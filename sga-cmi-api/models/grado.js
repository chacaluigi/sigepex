const { Schema, model, default: mongoose } = require('mongoose');

const GradoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    descripcion: {
        type: String,
    },
    nivel: {
        type: String,
        required: [true, 'El nivel es obligatorio'],
        enum: ['INICIAL', 'PRIMARIA', 'SECUNDARIA', 'OTRO']
    },
    academic_year: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicYear', required: true },
    sede: { type: mongoose.Schema.Types.ObjectId, ref: 'Sede', required: true },
    estado: {
        type: Boolean,
        default: true,
    },
}, { collection: 'grado', timestamps: true, versionKey: false });

module.exports = model('Grado', GradoSchema);