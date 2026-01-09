// controllers/proceso.js
const { processNews } = require("../services/newsProcessor.js");

const startProcess = async (req, res) => {
  try {
    console.log("🛠 Iniciando procesamiento de noticias para usuario:", req.uid);
    await processNews(req); // Pasamos todo el req que contiene uid
    res.status(200).json({
      message: "✅ Procesamiento completado.",
      userId: req.uid, // Opcional: devolver el ID para debugging
    });
  } catch (error) {
    console.error("⚠️ Error en procesamiento de noticias:", error);
    res.status(500).json({
      message: "❌ Error en el procesamiento.",
      error: error.message, // Devuelve el mensaje de error
    });
  }
};

module.exports = {
  startProcess,
};
