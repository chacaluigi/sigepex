const { Router } = require("express");

const {
  saveReport,
  getReports,
  updateReport,
  deleteReport,
  downloadImage,
} = require("../controllers/report.js");

const router = Router();

// 📌 Definir rutas CRUD para los reportes
router.post("/reports", saveReport); // Crear un reporte
router.get("/reports", getReports); // Obtener todos los reportes
router.put("/reports/:id", updateReport); // Modificar un reporte
router.delete("/reports/:id", deleteReport); // Eliminar un reporte
router.get("/proxy-image", downloadImage);

module.exports = router;
