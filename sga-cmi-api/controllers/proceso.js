const { processNews } = require("../services/newsProcessor.js");

const startProcess = async (req, res) => {
  try {
    console.log("🛠 Iniciando procesamiento de noticias...");
    await processNews();
    res.status(200).json({ message: "✅ Procesamiento completado." });
  } catch (error) {
    console.error("⚠️ Error en procesamiento de noticias:", error);
    res.status(500).json({ message: "❌ Error en el procesamiento." });
  }
};

module.exports = {
  startProcess,
};
