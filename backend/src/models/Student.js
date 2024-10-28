const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registration: { type: String, required: true, unique: true },
  birthDate: Date,
  grade: String,
  class: String,
  guardian: {
    name: String,
    phone: String,
    email: String,
  },
  academicRecord: [
    {
      year: Number,
      semester: Number,
      subjects: [
        {
          name: String,
          grade: Number,
          attendance: Number,
        },
      ],
    },
  ],
  financialRecord: [
    {
      dueDate: Date,
      value: Number,
      status: String,
      paymentDate: Date,
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);

// backend/src/controllers/StudentController.js
const Student = require("../models/Student");

class StudentController {
  async create(req, res) {
    try {
      const student = await Student.create(req.body);
      return res.status(201).json(student);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAll(req, res) {
    try {
      const students = await Student.find();
      return res.json(students);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Outros métodos CRUD
}

module.exports = new StudentController();
