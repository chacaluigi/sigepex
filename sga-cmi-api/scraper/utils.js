const fs = require("fs");
const crypto = require("crypto");

const fullNewsPath = process.env.FULL_NEWS_PATH;

// 📌 Función para leer JSON de noticias previas
const readPreviousNews = (filePath) => {
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      console.error("Error al leer el archivo JSON:", error);
    }
  }
  return [];
};

// 📌 Función para escribir JSON
const writeNewsToFile = (filePath, newsData) => {
  fs.writeFileSync(filePath, JSON.stringify(newsData, null, 2));
  console.log(`📄 ${newsData.length} nuevas noticias guardadas en ${filePath}`);
};

// 📌 Función para obtener el enlace de la noticia más reciente entre las 3 primeras noticias de news.json
const getMostRecentSavedLink = () => {
  try {
    const newsData = JSON.parse(fs.readFileSync(fullNewsPath, "utf-8"));

    if (newsData.length === 0) {
      console.log("⚠️ news.json está vacío.");
      return null;
    }

    // 📌 Tomar hasta las 3 primeras noticias
    const latestNews = newsData.slice(0, 3);

    // 📌 Convertir fecha y hora a formato comparable y obtener la más reciente
    const mostRecentNews = latestNews.reduce((latest, current) => {
      const currentDateTime = new Date(
        current.date.split("/").reverse().join("-") + `T${current.time}:00`
      );
      const latestDateTime = new Date(
        latest.date.split("/").reverse().join("-") + `T${latest.time}:00`
      );

      return currentDateTime > latestDateTime ? current : latest;
    });

    return mostRecentNews.link;
  } catch (error) {
    console.error("⚠️ Error al leer news.json:", error.message);
    return null;
  }
};

// 📌 Función para extraer enlaces de una página específica
const scrapePageLinks = async (page, url) => {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

    return await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          ".panels-flexible-region-first .noticia-lt .views-field-title a"
        )
      ).map((link) =>
        link.href.startsWith("http")
          ? link.href
          : `https://www.lostiempos.com${link.getAttribute("href")}`
      )
    );
  } catch (error) {
    console.error(`⚠️ Error al extraer enlaces de ${url}: ${error.message}`);
    return [];
  }
};

// 📌 Función principal para extraer enlaces de noticias y detenerse si encuentra un link repetido
const extractNewsLinks = async (page) => {
  const pagesToScrape = Array.from({ length: 2 }, (_, i) =>
    i === 0
      ? "https://www.lostiempos.com/ultimas-noticias"
      : `https://www.lostiempos.com/ultimas-noticias?page=${i}`
  );

  let articleLinks = [];
  const firstSavedLink = getMostRecentSavedLink();

  if (firstSavedLink) {
    console.log(`📌 Primer link en news.json: ${firstSavedLink}`);
  }

  for (const url of pagesToScrape) {
    const links = await scrapePageLinks(page, url);
    console.log(`✅ Encontradas ${links.length} noticias en ${url}`);

    for (const link of links) {
      if (firstSavedLink && link === firstSavedLink) {
        console.log("🛑 Link repetido encontrado. Deteniendo búsqueda.");
        return articleLinks; // Se detiene el proceso
      }
      articleLinks.push(link);
    }
  }

  return articleLinks;
};

// 📌 Función para extraer detalles de una noticia
const extractNewsDetails = async (page, link) => {
  try {
    await page.goto(link, { waitUntil: "domcontentloaded", timeout: 20000 });

    const newsInfo = await page.evaluate(() => {
      const title =
        document.querySelector(".node-title")?.innerText.trim() || "No title";
      const category =
        document.querySelector(".subsection")?.innerText.trim() ||
        "No category";
      const image = document.querySelector(".bxslider img")?.src || "No image";
      const author =
        document.querySelector(".field-name-field-autor a")?.innerText.trim() ||
        "No author";
      const dateRaw =
        document.querySelector(".date-publish")?.innerText.trim() || "No date";

      let date = "No date";
      let time = "No time";
      const dateMatch = dateRaw.match(/(\d{2}\/\d{2}\/\d{4})/);
      const timeMatch = dateRaw.match(/(\d{1,2})h(\d{2})/);
      if (dateMatch) date = dateMatch[1];
      if (timeMatch) time = `${timeMatch[1]}:${timeMatch[2]}`;

      const content =
        document.querySelector(".field-name-body")?.innerText.trim() ||
        "No content";

      return { title, category, image, author, date, time, content };
    });

    // 📌 Generar ID único
    const hash = crypto
      .createHash("sha256")
      .update(newsInfo.title + newsInfo.date + newsInfo.time)
      .digest("hex");
    newsInfo.id = hash;
    newsInfo.link = link;

    return newsInfo;
  } catch (error) {
    console.error(`⚠️ Error al extraer datos de ${link}: ${error.message}`);
    return null;
  }
};

module.exports = {
  readPreviousNews,
  writeNewsToFile,
  extractNewsLinks,
  extractNewsDetails,
};
