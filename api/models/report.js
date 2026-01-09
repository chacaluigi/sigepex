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
    fechaHora: { type: Date, required: true },
    hecho: String,
    actores: [
      {
        nombre: String,
        cargo: String,
      },
    ],
    probable_evolucion: String,
    image: String,
    solicitud: {
      type: Schema.Types.ObjectId,
      ref: "Solicitud",
      required: false,
    },
  },
  { collection: "reports", timestamps: true, versionKey: false }
);

module.exports = model("Report", ReportSchema);
