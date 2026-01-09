// routes/proceso.js
const { Router } = require("express");
const { startProcess } = require("../controllers/proceso");
const { validarJWT } = require("../middlewares/validar-jwt"); // Añade esta línea
const router = Router();

// Aplica el middleware validarJWT antes del controlador
router.post("/proceso", validarJWT, startProcess);

module.exports = router;
