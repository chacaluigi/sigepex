const { scrapeNews } = require("../scraper/scraper");
const { readPreviousNews, writeNewsToFile } = require("../scraper/utils");
const { filterNews } = require("../classifier/filterNews");
const { saveUniqueReports } = require("./saveUniqueReports");
const { spawn } = require("child_process");
const { addReportNumber } = require("./addReportNumber");

const fullNewsPath = process.env.FULL_NEWS_PATH;

async function processNews() {
  const previousNews = readPreviousNews(fullNewsPath);
  const previousIDs = new Set(previousNews.map((news) => news.id));

  function executePythonScript(scriptPath, args = []) {
    return new Promise((resolve, reject) => {
      console.log("dentro de executePythonScript");
      const pythonProcess = spawn("python", ["-u", scriptPath, ...args]); // 🔥 Agregamos `-u`

      // Capturar la salida en tiempo real
      pythonProcess.stdout.on("data", (data) => {
        console.log(`[PYTHON]: ${data.toString().trim()}`);
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`[PYTHON ERROR]: ${data.toString().trim()}`);
      });

      pythonProcess.on("close", (code) => {
        if (code === 0) {
          resolve(`✅ ${scriptPath} ejecutado correctamente.`);
        } else {
          reject(
            new Error(
              `❌ Error ejecutando ${scriptPath}, código de salida: ${code}`
            )
          );
        }
      });
    });
  }

  try {
    const newsData = await scrapeNews();

    // 📌 Filtrar solo noticias nuevas
    const newNews = newsData.filter((news) => !previousIDs.has(news.id));

    if (newNews.length > 0) {
      writeNewsToFile(fullNewsPath, newNews);
      console.log("📝 Noticias nuevas guardadas.");

      // 📌 Pasar las noticias a filterNews para clasificarlas
      await filterNews(newNews);

      // 📌 Ejecutar convertNews.py después del filtrado
      console.log("🚀 Ejecutando convertNews.py...");
      await executePythonScript("classifier/convertNews.py");
      console.log("✅ Conversión completada.");

      // 📌 Ejecutar addReportNumber.js después de la clasificación
      console.log("🚀 Ejecutando addReportNumber.js...");
      await addReportNumber();
      console.log("✅ Añadir numero de reporte completada.");

      // 📌 Guardar reportes en la base de datos
      console.log("💾 Guardando reportes en la base de datos...");
      await saveUniqueReports();
      console.log("✅ Reportes guardados en la base de datos.");
    } else {
      console.log("📌 No hay noticias nuevas para guardar.");
    }
  } catch (error) {
    console.error("⚠️ Error en el procesamiento de noticias:", error);
  }
}

module.exports = { processNews };
