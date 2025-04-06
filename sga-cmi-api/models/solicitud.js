const { Schema, model } = require("mongoose");

const SolicitudSchema = Schema(
  {
    usuario: { type: Schema.Types.ObjectId, ref: "Usuario", required: false },
    asignadoA: { type: Schema.Types.ObjectId, ref: "Usuario", required: false }, // Nuevo campo agregado
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
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
