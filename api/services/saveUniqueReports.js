const { saveReportInternal, reportExists } = require("../controllers/report");
const fs = require("fs");

// 📌 Ruta del archivo JSON con los reportes
const reportsPath = process.env.REPORTS_PATH;

// 📌 Función para convertir fecha y hora a objeto Date ISO
const parseCustomDateTime = (fechaStr, horaStr) => {
  if (!fechaStr || !horaStr) return new Date();

  // Dividir la fecha en día, mes, año
  const [day, month, year] = fechaStr.split("/").map(Number);

  // Dividir la hora en horas, minutos
  const [hours, minutes] = horaStr.split(":").map(Number);

  // Crear objeto Date (los meses en JS son 0-indexed, por eso month - 1)
  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
};

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
    try {
      const exists = await reportExists(report._id);
      if (!exists) {
        // Convertir fecha y hora a formato Date ISO
        const fechaHoraISO = parseCustomDateTime(report.fecha, report.hora);

        // Crear copia del reporte con el nuevo campo fechaHora
        const reportToSave = {
          ...report,
          fechaHora: fechaHoraISO,
          // Eliminamos los campos antiguos
        };

        delete reportToSave.fecha;
        delete reportToSave.hora;

        await saveReportInternal(reportToSave);
        console.log(`✅ Reporte guardado: ${report.numero_reporte}`);
      } else {
        console.log(`⚠️ Reporte duplicado, ignorado: ${report.numero_reporte}`);
      }
    } catch (error) {
      console.error(
        `⚠️ Error al procesar reporte ${report.numero_reporte}:`,
        error
      );
    }
  }

  console.log("🔄 Proceso de guardado finalizado.");
};

module.exports = { saveUniqueReports };
