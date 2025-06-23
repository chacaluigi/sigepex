// routes/fuente.js

const { Router } = require("express");
const { obtenerFuentes } = require("../controllers/fuente");

const router = Router();

// Rutas CRUD para solicitudes de análisis
router.get("/fuentes", obtenerFuentes); // get todas las solicitudes

module.exports = router;
