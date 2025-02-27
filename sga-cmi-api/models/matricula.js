const { Schema, model } = require('mongoose');

const MatriculaSchema = Schema({
    academic_year: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicYear',
        required: [true, 'El categoria es obligatorio'],
    },
    estudiante: {
        type: Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: [true, 'El categoria es obligatorio'],
    },
    grado: {
        type: Schema.Types.ObjectId,
        ref: 'Grado',
        required: [true, 'El categoria es obligatorio'],
    },
    comments: { 
        type: String 
    },
    estado: {
        type: Boolean,
        default: true,
    },
}, { collection: 'matricula', timestamps: true, versionKey: false });

module.exports = model('Matricula', MatriculaSchema);