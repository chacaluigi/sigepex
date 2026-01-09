const { response } = require("express");
const Post = require("../models/post");

// 📌 Guardar múltiples posts con ID de solicitud
const savePosts = async (posts, solicitudId) => {
  try {
    // Obtener solo los IDs de los posts existentes
    const existingPosts = await Post.find({
      id: { $in: posts.map((p) => p.id) },
    })
      .select("id")
      .lean();

    const existingIds = existingPosts.map((p) => p.id);

    // Filtrar posts que no existen y añadir el solicitudId
    const newPosts = posts
      .filter((p) => !existingIds.includes(p.id))
      .map((post) => ({
        ...post,
        solicitud: solicitudId, // Añadir el ID de la solicitud
      }));

    if (newPosts.length === 0) {
      return { success: true, message: "No hay posts nuevos para guardar" };
    }

    // Insertar solo los nuevos posts con el ID de solicitud
    const result = await Post.insertMany(newPosts, { ordered: false });

    return {
      success: true,
      message: `${result.length} posts guardados correctamente`,
      count: result.length,
    };
  } catch (error) {
    // Manejar errores de duplicados
    if (error.writeErrors) {
      const insertedCount = error.insertedDocs.length;
      return {
        success: true,
        message: `Se guardaron ${insertedCount} posts (algunos duplicados omitidos)`,
      };
    }

    console.error("⚠️ Error al guardar posts:", error);
    return {
      success: false,
      error: "Error al guardar posts",
      details: error.message,
    };
  }
};

// 📌 Obtener todos los posts (paginados)
const getPosts = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const limite = Math.max(1, Number(req.query.limite) || 10);
    const searchQuery = req.query.searchQuery;

    const filter = {};
    if (searchQuery) {
      filter.searchQuery = searchQuery;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      ok: true,
      posts,
      total,
      desde,
      limite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "⚠️ Error al obtener los posts",
    });
  }
};

// 📌 Obtener posts por solicitud
// controllers/post.js
const getPostsBySolicitud = async (req, res = response) => {
  try {
    const { solicitudId } = req.params;

    const posts = await Post.find({ solicitud: solicitudId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      ok: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los posts",
    });
  }
};

/* const getPostsBySolicitud = async (req, res = response) => {
  try {
    const { solicitudId } = req.params;

    const posts = await Post.find({ solicitud: solicitudId })
      .sort({ createdAt: -1 })
      .lean()
      .map((post) => ({
        ...post,
        solicitud: post.solicitud.toString(), // Convertir ObjectId a string
      }));

    res.json({
      ok: true,
      posts,
      count: posts.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener los posts",
    });
  }
}; */

module.exports = {
  savePosts,
  getPosts,
  getPostsBySolicitud,
};
