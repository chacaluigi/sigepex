const fs = require("fs");
const { getCurrentReportCount } = require("../controllers/report");

// 📌 Ruta del archivo JSON de reportes
const filePath = process.env.REPORTS_PATH;

// 📌 Función para añadir el campo `numero_reporte`
const addReportNumber = async () => {
  try {
    const currentCount = await getCurrentReportCount(); // Obtener cantidad actual en BD

    // 🔹 Leer el archivo JSON
    const data = fs.readFileSync(filePath, "utf8");
    let reportes = JSON.parse(data);

    // 🔹 Asignar número de reporte en orden **descendente**
    const totalReportes = reportes.length;
    reportes = reportes.map((reporte, index) => ({
      ...reporte,
      numero_reporte: currentCount + totalReportes - index, // 🔥 Se asigna en orden inverso
    }));

    // 🔹 Guardar de nuevo el archivo con los cambios
    fs.writeFileSync(filePath, JSON.stringify(reportes, null, 2), "utf8");
    console.log("✅ Número de reporte añadido correctamente a cada registro.");
  } catch (error) {
    console.error("❌ Error al procesar reportes:", error);
  }
};

module.exports = { addReportNumber };
