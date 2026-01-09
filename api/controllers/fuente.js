// controllers/fuenteController.js
const { response } = require("express");
const Fuente = require("../models/fuente");

const obtenerFuentes = async (req, res = response) => {
  try {
    const fuentes = await Fuente.find({});
    res.json(fuentes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  obtenerFuentes,
};
