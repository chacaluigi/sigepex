const { Schema, model } = require("mongoose");

const PostSchema = Schema(
  {
    contenido: {
      type: String,
      required: true,
    },
    fuente: {
      type: String,
      required: true,
    },
    fecha_publicacion: {
      type: Date,
      required: true,
    },
    imagenes: {
      type: String,
    },
    cantidad_replies: {
      type: Number,
      default: 0,
    },
    cantidad_likes: {
      type: Number,
      default: 0,
    },
    cantidad_views: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "post",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Post", PostSchema);
