const mongoose = require('mongoose');

const academicYearSchema = new mongoose.Schema({
  year: { type: String, required: true, unique: true },
  startDate: { type: Date },
  endDate: { type: Date },
  numBimestres: { type: Number },
  isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model('AcademicYear', academicYearSchema);