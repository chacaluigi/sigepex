const { response } = require("express");
const AcademicYear = require("../models/academic_year");

const getAcademicsYear = async (req, res = response) => {
  try {
    const academic_year = await AcademicYear.find().sort({ updatedAt: -1 });

    res.json(academic_year);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getAcademicYear = async (req, res = response) => {
  try {
    const academic_year = await AcademicYear.findById(req.params.id);

    if (!academic_year) {
      return res.status(404).json({
        ok: false,
        msg: "Año academico no encontrado",
      });
    }

    res.json(academic_year);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const registerAcademicYear = async (req, res = response) => {
  try {
    const { year, startDate, endDate, numBimestres, isActive } = req.body;

    const academicYearDB = await AcademicYear.findOne({ year });

    if (academicYearDB) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe con ese nombre",
      });
    }

    if (isActive) {
      const activeYear = await AcademicYear.findOne({ isActive: true });
      if (activeYear) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un registro activo. Solo puede haber un registro activo a la vez.",
        });
      }
    }

    const data = {
      year,
      startDate,
      endDate,
      numBimestres,
      isActive,
    };

    const academic_year = new AcademicYear(data);

    await academic_year.save();

    res.status(201).json(academic_year);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const updateAcademicYear = async (req, res = response) => {
  try {
    const { year, startDate, endDate, numBimestres, isActive } = req.body;

    const data = {
      year,
      startDate,
      endDate,
      numBimestres,
      isActive,
    };

    const academic_year = await AcademicYear.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(academic_year);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const deleteAcademicYear = async (req, res = response) => {
  try {
    const { id } = req.params;

    const academic_year = await AcademicYear.findById(id);

    if (!academic_year) {
      return res.status(404).json({
        ok: false,
        msg: "El dato no existe",
      });
    }

    const academic_yearDB = await AcademicYear.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    res.json(academic_yearDB);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getAcademicsYear,
  getAcademicYear,
  registerAcademicYear,
  updateAcademicYear,
  deleteAcademicYear,
};
