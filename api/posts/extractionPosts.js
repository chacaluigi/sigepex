const puppeteer = require("puppeteer");
const { loadSession } = require("./twitter-scraper/sessionManager.js");
const { isLoggedIn, login } = require("./twitter-scraper/auth.js");
const { scrapeTweets } = require("./twitter-scraper/scraper.js");
const { getSearchConfig } = require("./twitter-scraper/config.js");
const { savePosts } = require("../controllers/post.js");

async function extractionPosts(currentUserId, solicitudId) {
  console.log("🚀 Iniciando navegador...");

  // Obtener configuración de búsqueda desde MongoDB
  const SEARCH_CONFIG = await getSearchConfig(currentUserId);
  console.log("🔍 Configuración de búsqueda:", SEARCH_CONFIG);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null,
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
    loggedIn = await login(page);

    if (!loggedIn) {
      console.log("❌ No se pudo iniciar sesión. Cerrando navegador...");
      await browser.close();
      return;
    }
  } else {
    console.log("✅ Sesión restaurada exitosamente.");
  }

  // Continuar con el scraping usando la configuración obtenida
  const tweetsData = await scrapeTweets(page, SEARCH_CONFIG);

  //Guardar en el JSON local
  //await saveTweets(tweetsData);

  // Guardar en MongoDB
  const saveResult = await savePosts(tweetsData, solicitudId);
  console.log(saveResult.message);

  await browser.close();
  console.log("✅ Extracción completada.");
}

module.exports = {
  extractionPosts,
};
