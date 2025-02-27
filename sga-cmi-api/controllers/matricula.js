const { response } = require("express");

const Matricula = require("../models/matricula");
const Estudiante = require("../models/estudiante");

const getMatriculas = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const hasta = Math.max(0, Number(req.query.hasta) || 10);

    if (hasta <= 0 || desde >= hasta) {
      return res.json({
        matriculas: [],
        total: 0,
      });
    }

    const limite = hasta - desde;

    const [matriculas, total] = await Promise.all([
      Matricula.find()
        .populate("academic_year")
        .populate("grado")
        .populate("estudiante")
        .sort({ updatedAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Matricula.countDocuments(),
    ]);

    res.json({
      matriculas,
      total,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getMatricula = async (req, res = response) => {
  try {
    const matricula = await Matricula.findById(req.params.id).populate(
      "grado",
      "year_academic",
      "estudiante",
      "comments estado createdAt updatedAt"
    );

    if (!matricula) {
      return res.status(404).json({
        ok: false,
        msg: "Registro no encontrado",
      });
    }

    res.json({
      ok: true,
      matricula,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// obtener los estudiantes por grados
const getMatriculasByGrado = async (req, res = response) => {
  try {
    const desde = Math.max(0, Number(req.query.desde) || 0);
    const hasta = Math.max(0, Number(req.query.hasta) || 10);
    const { gradoId } = req.params;

    if (!gradoId) {
      return res.status(400).json({
        ok: false,
        msg: "Debe proporcionar un grado específico",
      });
    }

    if (hasta <= 0 || desde >= hasta) {
      return res.json({
        matriculas: [],
        total: 0,
      });
    }

    const limite = hasta - desde;

    const [matriculas, total] = await Promise.all([
      Matricula.find({ grado: gradoId }) // Filtramos por grado
        .populate("academic_year")
        .populate("grado")
        .populate("estudiante")
        .sort({ updatedAt: -1 })
        .skip(desde)
        .limit(limite)
        .lean(),
      Matricula.countDocuments({ grado: gradoId }), // Contamos solo las matriculas del grado
    ]);

    res.json({
      matriculas,
      total,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const registrarMatricula = async (req, res = response) => {
  try {
    const { estudiante, academic_year } = req.body;

    const matriculaExistente = await Matricula.findOne({ 
      estudiante, 
      academic_year 
    }).lean();

    if (matriculaExistente) {
      return res.status(400).json({
        ok: false,
        msg: `El estudiante ya está matriculado en este año académico`,
      });
    }

    // Crear la nueva matrícula
    const matricula = new Matricula(req.body);

    // Guardar la matrícula en la base de datos
    await matricula.save();

    // Poblar las relaciones para devolver una respuesta completa
    const matriculaPopulada = await Matricula.findById(matricula._id)
      .populate('academic_year')
      .populate('estudiante')
      .populate('grado');
    
    res.status(201).json({
      ok: true,
      matricula: matriculaPopulada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};


const actualizarMatricula = async (req, res = response) => {
  const id = req.params.id;

  try {
    const matriculaDB = await Matricula.findById(id);

    if (!matriculaDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un estudiante con ese id",
      });
    }

    const cambiosMatricula = { ...req.body };

    const matriculaActualizado = await Matricula.findByIdAndUpdate(
      id,
      cambiosMatricula,
      { new: true }
    );

    res.json({
      ok: true,
      matricula: matriculaActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarMatricula = async (req, res = response) => {
  try {
    const { id } = req.params;

    const matricula = await Matricula.findByIdAndDelete(id);

    res.json({
      ok: true,
      matricula,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const searchStudent = async (req, res = response) => {
  try {
    const { search } = req.params;

    const regex = new RegExp(search, "i");

    const estudiantes = await Estudiante.find({
      $or: [{ nombres: regex }, { apellidos: regex }, { dni: regex }],
    }).populate("grado", "nombre descripcion estado createdAt updatedAt");

    res.json(estudiantes);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getMatriculasPorGrado = async (req, res = response) => {
  try {
    const { gradoId } = req.params;

    const matriculas = await Matricula.find({ grado: gradoId })
      .populate('academic_year')
      .populate('estudiante')
      .populate('grado');
    
    res.json({
      ok: true,
      matriculas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador',
    });
  }
};

module.exports = {
  getMatriculas,
  getMatricula,
  getMatriculasByGrado,
  registrarMatricula,
  actualizarMatricula,
  eliminarMatricula,
  searchStudent,
  getMatriculasPorGrado,
};
