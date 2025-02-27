const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema(
  {
    nombre: {
      type: String,
      required: [true, "Los nombres y apellidos son obligatorios"],
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    brand_color: {
      type: String,
      default: "#000000",
    },
    img: {
      type: String,
    },
    rol: {
      type: Schema.Types.ObjectId,
      ref: "Rol",
      required: true
    },
    sedes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Sede",
      },
    ],
    estado: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "usuario", timestamps: true, versionKey: false }
);

module.exports = model("Usuario", UsuarioSchema);
