const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  requirements: {
    type: String,
    required: false,
    trim: true,
  },
  linkedInUrl: {
    type: String,
    required: false,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Vacancy = mongoose.model('Vacancy', vacancySchema);

module.exports = Vacancy;
