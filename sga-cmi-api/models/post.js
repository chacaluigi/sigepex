const { Schema, model } = require("mongoose");

const PostSchema = Schema(
  {
    id: { type: String, required: true, unique: true },
    user: { type: String, required: true },
    content: { type: String, required: true },
    time: { type: Date, default: "N/A" },
    replies: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    link: { type: String, required: true },
    searchQuery: { type: String, required: true },
    solicitud: {
      type: Schema.Types.ObjectId,
      ref: "Solicitud",
      required: false,
    },
    processed: { type: Boolean, default: false },
  },
  {
    collection: "posts",
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* // Índices para mejorar las búsquedas
PostSchema.index({ id: 1 });
PostSchema.index({ searchQuery: 1 });
PostSchema.index({ solicitud: 1 });
PostSchema.index({ createdAt: -1 }); */

module.exports = model("Post", PostSchema);
