const { Schema, model } = require("mongoose");

const SolicitudSchema = Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: false },
    asignadoA: { type: Schema.Types.ObjectId, ref: "Usuario", required: false },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    palabrasClave: { type: [String], default: [] },
    fuentes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Fuente",
        default: [],
      },
    ],
    rangoFechaHora: {
      // Nuevo campo: rango de fecha y hora
      inicio: { type: Date },
      fin: { type: Date },
    },
    estado: {
      type: String,
      enum: ["Pendiente", "En Proceso", "Completado"],
      default: "Pendiente",
    },
    fecha_creacion: { type: Date, default: Date.now },
    fecha_finalizacion: { type: Date },
  },
  { collection: "solicitudes", timestamps: true, versionKey: false }
);

module.exports = model("Solicitud", SolicitudSchema);
