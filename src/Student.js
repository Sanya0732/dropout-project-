const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true
  },
  affiliated: { // corrected field name
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  caste: {
    type: String,
    required: true
  },
  admittedIn: {
    type: String,
    required: true
  },
  droppedOutIn: {
    type: String
  },
  reason: {
    type: String
  }
});

module.exports = mongoose.model("Student", studentSchema);
