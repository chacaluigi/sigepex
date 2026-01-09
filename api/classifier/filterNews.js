const fs = require("fs");

// Archivo de salida
const archivoSalida = process.env.LEAKED_NEWS_PATH;

// Categorías a excluir
const categoriasExcluir = [
  "Cine",
  "Fútbol",
  "Fútbol Int.",
  "Multideportivo",
  "Espectáculos",
  "Música",
  "Cultura",
  "Tenis",
  "Ciencia",
  "Tecnología",
];

/**
 * Filtra noticias excluyendo ciertas categorías y las guarda en un archivo.
 * @param {Array} noticias - Lista de noticias obtenidas del scraper.
 */
const filterNews = (noticias) => {
  return new Promise((resolve, reject) => {
    try {
      const totalNoticias = noticias.length;

      // Filtrar noticias excluyendo ciertas categorías
      const noticiasFiltradas = noticias.filter(
        (noticia) => !categoriasExcluir.includes(noticia.category)
      );

      console.log(`📊 Total de noticias recibidas: ${totalNoticias}`);
      console.log(
        `✅ Noticias después del filtrado: ${noticiasFiltradas.length}`
      );

      // Guardar el resultado en el archivo de salida
      fs.writeFile(
        archivoSalida,
        JSON.stringify(noticiasFiltradas, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("❌ Error al guardar el archivo filtrado:", err);
            return reject(err);
          }
          console.log(`📁 Noticias filtradas guardadas en ${archivoSalida}`);
          resolve();
        }
      );
    } catch (error) {
      console.error("❌ Error al procesar las noticias:", error);
      reject(error);
    }
  });
};

module.exports = { filterNews };
