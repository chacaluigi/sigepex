const { Schema, model } = require("mongoose");

const ReportSchema = Schema(
  {
    _id: String,
    numero_reporte: Number,
    tema: String,
    categoria: String,
    factor: [String],
    lugar: [String],
    departamento: [String],
    pais: [String],
    fuentes: [String],
    fecha: String,
    hora: String,
    hecho: String,
    actores: [
      {
        nombre: String,
        cargo: String,
      },
    ],
    probable_evolucion: String,
    image: String,
  },
  { collection: "reports", timestamps: true, versionKey: false }
);

module.exports = model("Report", ReportSchema);
