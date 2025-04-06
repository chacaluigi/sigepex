// routes/solicitud.js

const { Router } = require("express");
const {
  crearSolicitud,
  getSolicitudes,
  getSolicitud,
  actualizarSolicitud,
  eliminarSolicitud,
} = require("../controllers/solicitud");

const router = Router();

// Rutas CRUD para solicitudes de análisis
router.post("/solicitudes", crearSolicitud); // Crear una solicitud
router.get("/solicitudes", getSolicitudes); // get todas las solicitudes
router.get("/solicitudes/:id", getSolicitud); // get una solicitud por ID
router.put("/solicitudes/:id", actualizarSolicitud); // Modificar una solicitud
router.delete("/solicitudes/:id", eliminarSolicitud); // Eliminar una solicitud

module.exports = router;
