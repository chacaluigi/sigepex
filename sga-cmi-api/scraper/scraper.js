const puppeteer = require("puppeteer");
const { extractNewsLinks, extractNewsDetails } = require("./utils");

const scrapeNews = async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log("🔎 Extrayendo enlaces de noticias...");
  const articleLinks = await extractNewsLinks(page);

  console.log(`📌 Total de noticias encontradas: ${articleLinks.length}`);

  let newsData = [];
  const concurrencyLimit = 3;

  for (let i = 0; i < articleLinks.length; i += concurrencyLimit) {
    const batch = articleLinks.slice(i, i + concurrencyLimit);
    await Promise.all(
      batch.map(async (link) => {
        try {
          const newsPage = await browser.newPage();
          const newsInfo = await extractNewsDetails(newsPage, link);
          if (newsInfo) newsData.push(newsInfo);
          await newsPage.close();
        } catch (error) {
          console.error(`⚠️ Error al procesar ${link}: ${error.message}`);
        }
      })
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  await browser.close();
  return newsData;
};

module.exports = { scrapeNews };
