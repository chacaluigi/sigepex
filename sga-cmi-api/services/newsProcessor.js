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

  async function asociarReportesASolicitudes() {
    try {
      const Solicitud = require("../models/solicitud");
      const Report = require("../models/report");

      console.log("🔍 Buscando solicitudes activas...");
      const solicitudes = await Solicitud.find({
        estado: { $in: ["Pendiente", "En Proceso"] },
        "rangoFechaHora.inicio": { $exists: true, $ne: null },
        "rangoFechaHora.fin": { $exists: true, $ne: null },
        palabrasClave: { $exists: true, $not: { $size: 0 } },
      });

      if (solicitudes.length === 0) {
        console.log("📌 No hay solicitudes activas con criterios de búsqueda");
        return;
      }

      console.log(`📋 Procesando ${solicitudes.length} solicitudes...`);

      for (const solicitud of solicitudes) {
        try {
          // 1. Buscar reportes en el rango de fechas de la solicitud
          const reportesEnRango = await Report.find({
            fechaHora: {
              $gte: solicitud.rangoFechaHora.inicio,
              $lte: solicitud.rangoFechaHora.fin,
            },
            solicitud: { $exists: false }, // Solo reportes no asignados
          });

          if (reportesEnRango.length === 0) {
            console.log(
              `📌 No hay reportes en rango para solicitud ${solicitud._id}`
            );
            continue;
          }

          // 2. Filtrar por palabras clave en el tema
          const regexPalabras = new RegExp(
            solicitud.palabrasClave
              .map((p) => p.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
              .join("|"),
            "i"
          );

          const reportesFiltrados = reportesEnRango.filter((reporte) =>
            regexPalabras.test(reporte.tema)
          );

          if (reportesFiltrados.length === 0) {
            console.log(
              `📌 No hay reportes con palabras clave para solicitud ${solicitud._id}`
            );
            continue;
          }

          console.log(
            `📌 Asociando ${reportesFiltrados.length} reportes a solicitud ${solicitud._id}`
          );

          // 3. Actualizar los reportes con la referencia a la solicitud
          await Report.updateMany(
            { _id: { $in: reportesFiltrados.map((r) => r._id) } },
            { $set: { solicitud: solicitud._id } }
          );

          // Opcional: Actualizar estado de la solicitud si es necesario
          if (solicitud.estado === "Pendiente") {
            await Solicitud.findByIdAndUpdate(solicitud._id, {
              estado: "En Proceso",
            });
          }
        } catch (error) {
          console.error(
            `⚠️ Error procesando solicitud ${solicitud._id}:`,
            error
          );
        }
      }

      console.log("✅ Proceso de asociación de reportes completado");
    } catch (error) {
      console.error("⚠️ Error en asociarReportesASolicitudes:", error);
    }
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
    // 📌 Asociar reportes a solicitudes
    console.log("🔗 Asociando reportes a solicitudes...");
    await asociarReportesASolicitudes();
    console.log("✅ Asociación de reportes completada.");
  } catch (error) {
    console.error("⚠️ Error en el procesamiento de noticias:", error);
  }
}

module.exports = { processNews };
