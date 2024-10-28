const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String,
  credits: Number,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  schedule: [
    {
      day: String,
      startTime: String,
      endTime: String,
    },
  ],
});

module.exports = mongoose.model("Course", courseSchema);

// backend/src/models/Grade.js
const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  semester: String,
  grades: [
    {
      type: { type: String },
      value: Number,
      weight: Number,
      date: Date,
    },
  ],
  attendance: [
    {
      date: Date,
      present: Boolean,
      justification: String,
    },
  ],
  finalGrade: Number,
});

module.exports = mongoose.model("Grade", gradeSchema);
