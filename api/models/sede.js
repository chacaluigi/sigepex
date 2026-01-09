const {Schema, model } = require('mongoose');

const SedeSchema = Schema({
    nombre: {
        type: String,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
    },
    direccion: {
        type: String,
    },
    ciudad: {
        type: String,
    },
    telefono: {
        type: String,
    },
    email: {
        type: String,
    },
    capacidad: {
        type: Number,
    },
    director: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    estado: {
        type: String,
        default: 'activo'
    },
},{ collection: 'sede', timestamps: true, versionKey: false });

module.exports = model('Sede', SedeSchema);