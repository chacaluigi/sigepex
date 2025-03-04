const Report = require("../models/report"); // Importamos el modelo de Reporte

// 📌 Función para obtener la cantidad actual de reportes en la base de datos
const getCurrentReportCount = async () => {
  try {
    const count = await Report.countDocuments(); // 📌 Obtener el número actual de reportes
    console.log(`📊 Reportes actuales en la BD: ${count}`);
    return count;
  } catch (error) {
    console.error("❌ Error al obtener el conteo de reportes:", error);
    return 0; // Si hay error, comenzar desde 0
  }
};

// 📌 Función para verificar si un reporte ya existe
const reportExists = async (id) => {
  return await Report.exists({ _id: id });
};

// ✅ Función para uso interno, sin `req` ni `res`
const saveReportInternal = async (reportData) => {
  try {
    const newReport = new Report(reportData);
    await newReport.save();
    console.log("✅ Reporte guardado correctamente");
    return { success: true, message: "Reporte guardado correctamente" };
  } catch (error) {
    console.error("⚠️ Error al guardar el reporte:", error);
    return { success: false, error: "Error al guardar el reporte" };
  }
};

// 📌 Guardar un nuevo reporte
const saveReport = async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.status(201).json({ message: "✅ Reporte guardado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "⚠️ Error al guardar el reporte" });
  }
};

// 📌 Obtener todos los reportes
const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "⚠️ Error al obtener los reportes" });
  }
};

// 📌 Modificar un reporte por ID
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "✅ Reporte actualizado" });
  } catch (error) {
    res.status(500).json({ error: "⚠️ Error al actualizar el reporte" });
  }
};

// 📌 Eliminar un reporte por ID
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    await Report.findByIdAndDelete(id);
    res.status(200).json({ message: "✅ Reporte eliminado" });
  } catch (error) {
    res.status(500).json({ error: "⚠️ Error al eliminar el reporte" });
  }
};

module.exports = {
  getCurrentReportCount,
  reportExists,
  saveReportInternal,
  saveReport,
  getReports,
  updateReport,
  deleteReport,
};
