import crypto from "crypto";
import { SEARCH_URL } from "./config.js";

export async function scrapeTweets(page) {
  console.log("📡 Buscando tweets...");

  let allTweets = [];
  const { queries, users, sinceDate, untilDate } = SEARCH_URL;

  // Construir la parte de usuarios para la URL
  const usersQuery = users.map((user) => `from%3A${user}`).join("%20OR%20");

  for (const query of queries) {
    const searchUrl = `https://x.com/search?q=${encodeURIComponent(
      query
    )}%20(${usersQuery})%20until%3A${untilDate}%20since%3A${sinceDate}%20-filter%3Areplies&f=live&src=typed_query`;

    console.log(`🔍 Buscando: "${query}"`);
    console.log(`👥 Usuarios: ${users.join(", ")}`);
    console.log(`📅 Fechas: ${sinceDate} a ${untilDate}`);
    console.log(`🔗 URL: ${searchUrl}`);

    try {
      await page.goto(searchUrl, { waitUntil: "networkidle2", timeout: 30000 });

      // Esperar a que cargue algún tweet o el mensaje de no resultados
      try {
        await page.waitForSelector('article, div[data-testid="emptyState"]', {
          timeout: 10000,
        });
      } catch (e) {
        console.log(
          "⚠️ No se encontraron elementos de tweets ni mensaje de vacío"
        );
      }

      // Verificar si hay mensaje de no resultados
      const noResults = await page.evaluate(() => {
        const emptyState = document.querySelector(
          'div[data-testid="emptyState"]'
        );
        return emptyState ? emptyState.innerText.includes("No results") : false;
      });

      if (noResults) {
        console.log(`⚠️ No se encontraron tweets para "${query}"`);
        continue;
      }

      let tweets = [];
      const maxTweets = 5;
      let scrollAttempts = 0;
      const maxScrollAttempts = 3;

      while (tweets.length < maxTweets && scrollAttempts < maxScrollAttempts) {
        scrollAttempts++;

        const newTweets = await page.evaluate((searchQuery) => {
          return Array.from(document.querySelectorAll("article")).map(
            (tweet) => {
              // Selectores más robustos
              const userElement = tweet.querySelector(
                '[data-testid="User-Name"]'
              );
              const contentElement = tweet.querySelector(
                '[data-testid="tweetText"]'
              );
              const timeElement = tweet.querySelector("time");
              const linkElement = tweet.querySelector('a[href*="/status/"]'); // Selector para el enlace

              // Métricas de interacción
              const replyElement = tweet.querySelector('[data-testid="reply"]');
              const likeElement = tweet.querySelector('[data-testid="like"]');
              const viewElement = tweet.querySelector('a[href*="/analytics"]');

              return {
                user: userElement
                  ? userElement.innerText.split("\n")[0]
                  : "N/A",
                content: contentElement ? contentElement.innerText : "N/A",
                time: timeElement
                  ? timeElement.getAttribute("datetime")
                  : "N/A",
                replies: replyElement
                  ? replyElement
                      .getAttribute("aria-label")
                      .replace(/\D/g, "") || "0"
                  : "0",
                likes: likeElement
                  ? likeElement.getAttribute("aria-label").replace(/\D/g, "") ||
                    "0"
                  : "0",
                views: viewElement
                  ? viewElement.innerText.replace(/\D/g, "") || "0"
                  : "0",
                link: linkElement
                  ? `https://x.com${linkElement.getAttribute("href")}`
                  : "N/A", // Construye el enlace completo
                searchQuery,
              };
            }
          );
        }, query);

        // Filtrar duplicados y añadir
        const uniqueNewTweets = newTweets.filter(
          (newTweet) => !tweets.some((t) => t.content === newTweet.content)
        );
        tweets = [...tweets, ...uniqueNewTweets];

        // Scroll solo si necesitamos más tweets
        if (tweets.length < maxTweets) {
          await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Reemplazo de waitForTimeout
        }
      }

      if (tweets.length > 0) {
        console.log(`✅ Encontrados ${tweets.length} tweets para "${query}"`);
        allTweets = [...allTweets, ...tweets.slice(0, maxTweets)];
      } else {
        console.log(`⚠️ No se capturaron tweets para "${query}"`);
      }
    } catch (error) {
      console.error(`❌ Error en "${query}":`, error.message);
      // Captura de pantalla para diagnóstico
      await page.screenshot({
        path: `error_${query.replace(/\s+/g, "_")}.png`,
      });
    }
  }

  return allTweets.map((tweet) => ({
    id: crypto
      .createHash("md5")
      .update(tweet.user + tweet.content + tweet.time)
      .digest("hex"),
    ...tweet,
  }));
}
