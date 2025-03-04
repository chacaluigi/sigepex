const { saveReportInternal, reportExists } = require("../controllers/report");
const fs = require("fs");

// 📌 Ruta del archivo JSON con los reportes
const reportsPath = process.env.REPORTS_PATH;

// 📌 Función para leer los reportes desde el JSON
const readReportsFromFile = () => {
  try {
    if (fs.existsSync(reportsPath)) {
      const data = fs.readFileSync(reportsPath, "utf8");
      return JSON.parse(data);
    } else {
      console.error("⚠️ El archivo reports.json no existe.");
      return [];
    }
  } catch (error) {
    console.error("⚠️ Error al leer reports.json:", error);
    return [];
  }
};

// 📌 Función para guardar reportes sin duplicados en la base de datos
const saveUniqueReports = async () => {
  const reports = readReportsFromFile();

  if (reports.length === 0) {
    console.log("⚠️ No hay reportes para guardar.");
    return;
  }

  for (const report of reports) {
    const exists = await reportExists(report._id);
    if (!exists) {
      await saveReportInternal(report);
      console.log(`✅ Reporte guardado: ${report.numero_reporte}`);
    } else {
      console.log(`⚠️ Reporte duplicado, ignorado: ${report.numero_reporte}`);
    }
  }

  console.log("🔄 Proceso de guardado finalizado.");
};

module.exports = { saveUniqueReports };
