const puppeteer = require("puppeteer");
const { loadSession } = require("./twitter-scraper/sessionManager.js");
const { isLoggedIn, login } = require("./twitter-scraper/auth.js");
const { scrapeTweets } = require("./twitter-scraper/scraper.js");
const { saveTweets } = require("./twitter-scraper/fileManager.js");

async function extractionPosts() {
  console.log("🚀 Iniciando navegador...");

  const browser = await puppeteer.launch({
    headless: false, // Modo visible para inicio manual
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null, // Pantalla completa
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36"
  );

  // Intentar cargar sesión existente
  const sessionLoaded = await loadSession(page);
  let loggedIn = sessionLoaded && (await isLoggedIn(page));

  if (!loggedIn) {
    console.log("🔐 No hay sesión activa, iniciando modo manual...");
    loggedIn = await login(page); // Inicio manual

    if (!loggedIn) {
      console.log("❌ No se pudo iniciar sesión. Cerrando navegador...");
      await browser.close();
      return;
    }
  } else {
    console.log("✅ Sesión restaurada exitosamente.");
  }

  // Continuar con el scraping si se autenticó
  const tweetsData = await scrapeTweets(page);
  await saveTweets(tweetsData);

  await browser.close();
  console.log("✅ Extracción completada.");
}

module.exports = {
  extractionPosts,
};
