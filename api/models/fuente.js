const { Schema, model } = require("mongoose");

const FuenteSchema = Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      unique: true,
    },
    usuario: {
      type: String,
      trim: true,
      default: null,
    },
    descripcion: {
      type: String,
      trim: true,
      default: "",
    },
    tipo: {
      type: String,
      enum: ["Medio de comunicación", "Político", "Periodista", "Activista"],
      default: "Medio de comunicación",
    },
    activo: {
      type: Boolean,
      default: true,
    },
    metadata: {
      fechaCreacion: {
        type: Date,
        default: Date.now,
      },
      ultimaActualizacion: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    collection: "fuentes",
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Índices para mejorar performance en búsquedas comunes
FuenteSchema.index({ nombre: 1 }); // Búsqueda por nombre
FuenteSchema.index({ tipo: 1 }); // Búsqueda por tipo
FuenteSchema.index({ usuario: 1 }); // Búsqueda por usuario

// Middleware para actualizar fecha de modificación antes de guardar
FuenteSchema.pre("save", function (next) {
  this.metadata.ultimaActualizacion = new Date();
  next();
});

// Virtual para obtener solicitudes relacionadas (opcional)
FuenteSchema.virtual("solicitudes", {
  ref: "Solicitud",
  localField: "_id",
  foreignField: "fuentes",
  justOne: false,
});

module.exports = model("Fuente", FuenteSchema);
