const { Router } = require("express");
const { getPostsBySolicitud } = require("../controllers/post.js");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// 📌 Definir rutas CRUD para los reportes
router.get("/posts/solicitud/:solicitudId", validarJWT, getPostsBySolicitud);

module.exports = router;
