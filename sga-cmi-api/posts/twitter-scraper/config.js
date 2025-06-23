// config.js
const Solicitud = require("../../models/solicitud");

// Función para formatear la fecha correctamente
const formatDate = (dateObj) => {
  // Si es un objeto Date
  if (dateObj instanceof Date) {
    return dateObj.toISOString().split("T")[0];
  }
  // Si es un string (por si acaso)
  if (typeof dateObj === "string") {
    return dateObj.split("T")[0];
  }
  // Si no es ninguno de los anteriores
  throw new Error("Formato de fecha no soportado");
};

async function getSearchConfig(userId) {
  try {
    // Buscar la solicitud asignada al usuario actual con las fuentes pobladas
    const solicitud = await Solicitud.findOne({
      asignadoA: userId,
      estado: "Pendiente",
    })
      .populate("fuentes", "usuario -_id") // Solo obtener el campo 'usuario' de las fuentes
      .exec();

    if (!solicitud) {
      throw new Error(
        "No se encontró una solicitud pendiente asignada al usuario."
      );
    }

    // Verificar que exista rango de fechas
    if (
      !solicitud.rangoFechaHora ||
      !solicitud.rangoFechaHora.inicio ||
      !solicitud.rangoFechaHora.fin
    ) {
      throw new Error("La solicitud no tiene un rango de fechas configurado.");
    }

    // Extraer los usuarios de las fuentes, filtrando valores nulos/undefined
    const usuariosFuentes = solicitud.fuentes
      .map((fuente) => fuente.usuario)
      .filter((usuario) => usuario); // Filtrar usuarios nulos o undefined

    // Verificar que haya usuarios/fuentes configurados
    if (usuariosFuentes.length === 0) {
      throw new Error("La solicitud no tiene fuentes configuradas.");
    }

    // Verificar que haya palabras clave
    if (!solicitud.palabrasClave || solicitud.palabrasClave.length === 0) {
      throw new Error("La solicitud no tiene palabras clave configuradas.");
    }

    return {
      queries: solicitud.palabrasClave,
      users: usuariosFuentes,
      sinceDate: formatDate(solicitud.rangoFechaHora.inicio),
      untilDate: formatDate(solicitud.rangoFechaHora.fin),
    };
  } catch (error) {
    console.error("Error al obtener configuración de búsqueda:", error.message);

    // Retornar valores por defecto en caso de error
    return {
      queries: ["pollo", "gasolina"],
      users: [
        "eldiario_net",
        "LaRazon_Bolivia",
        "grupoeldeber",
        "ExitoNoticias",
      ],
      sinceDate: "2025-06-11",
      untilDate: "2025-06-14",
    };
  }
}

/* async function getSearchConfig(userId) {
  try {
    // Buscar la solicitud asignada al usuario actual
    const solicitud = await Solicitud.findOne({
      asignadoA: userId,
      estado: "Pendiente",
    }).exec();

    console.log(solicitud);

    if (!solicitud) {
      throw new Error(
        "No se encontró una solicitud pendiente asignada al usuario."
      );
    }

    return {
      queries: solicitud.palabrasClave,
      users: [
        "eldiario_net",
        "LaRazon_Bolivia",
        "grupoeldeber",
        "ExitoNoticias",
      ],
      sinceDate: formatDate(solicitud.rangoFechaHora.inicio),
      untilDate: formatDate(solicitud.rangoFechaHora.fin),
    };
  } catch (error) {
    console.error("Error al obtener configuración de búsqueda:", error);
    // Retornar valores por defecto en caso de error
    return {
      queries: ["pollo", "gasolina"],
      users: [
        "eldiario_net",
        "LaRazon_Bolivia",
        "grupoeldeber",
        "ExitoNoticias",
      ],
      sinceDate: "2025-06-11",
      untilDate: "2025-06-14",
    };
  }
} */

const SESSION_FILE = "posts/twitter_session.json";
const JSON_FILE = "posts/data/tweets.json";
const LOGIN_URL = "https://x.com/login";
const HOME_URL = "https://x.com/home";

// Exportar como objeto CommonJS
module.exports = {
  SESSION_FILE,
  JSON_FILE,
  LOGIN_URL,
  HOME_URL,
  getSearchConfig,
};
