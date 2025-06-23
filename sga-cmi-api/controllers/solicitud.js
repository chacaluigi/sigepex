const { response } = require("express");
const Solicitud = require("../models/solicitud");

const getSolicitudes = async (req, res = response) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const skip = (page - 1) * perPage;

    const [solicitudes, total] = await Promise.all([
      Solicitud.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .populate("usuario", "nombre email")
        .populate("asignadoA", "nombre email")
        .populate("fuentes", "nombre usuario tipo") // Añade populate para fuentes
        .lean(),
      Solicitud.countDocuments(),
    ]);

    res.json({
      ok: true,
      solicitudes,
      currentPage: page,
      totalRows: total,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener las solicitudes",
    });
  }
};

const getSolicitud = async (req, res = response) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findById(id)
      .populate("usuario", "nombre email")
      .populate("asignadoA", "nombre email")
      .populate("reportes") // Popula los reportes asociados
      .populate("fuentes", "nombre usuario tipo"); // Añade populate para fuentes

    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        msg: "Solicitud no encontrada",
      });
    }

    res.json({
      ok: true,
      solicitud,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener la solicitud",
    });
  }
};

const crearSolicitud = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, asignadoA, usuario } = req.body;

    // Verifica que los campos requeridos estén presentes
    if (!titulo || !usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Los campos 'titulo' y 'usuario' son obligatorios.",
      });
    }

    const solicitud = new Solicitud({
      titulo,
      descripcion,
      prioridad,
      asignadoA,
      usuario,
    });

    await solicitud.save();

    res.status(201).json({
      ok: true,
      solicitud,
    });
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear la solicitud",
    });
  }
};

const actualizarSolicitud = async (req, res = response) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Convertir palabras clave a array si viene como string
    if (typeof updateData.palabrasClave === "string") {
      updateData.palabrasClave = updateData.palabrasClave
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);
    }

    // Convertir fechas a objetos Date si vienen como strings
    if (updateData.rangoFechaHora) {
      if (
        updateData.rangoFechaHora.inicio &&
        typeof updateData.rangoFechaHora.inicio === "string"
      ) {
        updateData.rangoFechaHora.inicio = new Date(
          updateData.rangoFechaHora.inicio
        );
      }
      if (
        updateData.rangoFechaHora.fin &&
        typeof updateData.rangoFechaHora.fin === "string"
      ) {
        updateData.rangoFechaHora.fin = new Date(updateData.rangoFechaHora.fin);
      }
    }

    // Manejar fecha de finalización si el estado cambia a Completado
    if (updateData.estado === "Completado" && !updateData.fecha_finalizacion) {
      updateData.fecha_finalizacion = new Date();
    }

    const solicitud = await Solicitud.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("usuario", "nombre email")
      .populate("asignadoA", "nombre email")
      .populate("fuentes", "nombre usuario tipo descripcion");

    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        msg: "Solicitud no encontrada",
      });
    }

    res.json({
      ok: true,
      solicitud: {
        _id: solicitud._id,
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        palabrasClave: solicitud.palabrasClave,
        rangoFechaHora: solicitud.rangoFechaHora,
        fuentes: solicitud.fuentes, // Añadido fuentes a la respuesta
        estado: solicitud.estado,
        fecha_creacion: solicitud.fecha_creacion,
        fecha_finalizacion: solicitud.fecha_finalizacion,
        usuario: solicitud.usuario,
        asignadoA: solicitud.asignadoA,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar la solicitud",
      error: error.message,
      s,
    });
  }
};

const editarSolicitud = async (req, res = response) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      ...(req.body.estado === "Completado" && !req.body.fecha_finalizacion
        ? { fecha_finalizacion: new Date() }
        : {}),
    };

    const solicitud = await Solicitud.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("usuario", "nombre")
      .populate("asignadoA", "nombre");

    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        msg: "Solicitud no encontrada",
      });
    }

    res.json({
      ok: true,
      solicitud: {
        _id: solicitud._id,
        titulo: solicitud.titulo,
        descripcion: solicitud.descripcion,
        estado: solicitud.estado,
        fecha_creacion: solicitud.fecha_creacion,
        fecha_finalizacion: solicitud.fecha_finalizacion,
        usuario: solicitud.usuario,
        asignadoA: solicitud.asignadoA,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al editar la solicitud",
      error: error.message,
    });
  }
};

const eliminarSolicitud = async (req, res = response) => {
  try {
    const { id } = req.params;
    const solicitud = await Solicitud.findByIdAndDelete(id);

    if (!solicitud) {
      return res.status(404).json({
        ok: false,
        msg: "Solicitud no encontrada",
      });
    }

    res.json({
      ok: true,
      msg: "Solicitud eliminada",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar la solicitud",
    });
  }
};

module.exports = {
  getSolicitudes,
  getSolicitud,
  crearSolicitud,
  actualizarSolicitud,
  editarSolicitud,
  eliminarSolicitud,
};
