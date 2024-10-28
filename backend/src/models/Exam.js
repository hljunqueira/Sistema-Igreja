const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  duration: Number, // em minutos
  questions: [
    {
      questionText: String,
      type: { type: String, enum: ["multiple_choice", "essay", "true_false"] },
      options: [String],
      correctAnswer: String,
      points: Number,
    },
  ],
  submissions: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      answers: [
        {
          questionIndex: Number,
          answer: String,
        },
      ],
      score: Number,
      submittedAt: Date,
    },
  ],
});

// frontend/src/components/ExamComponent.js
import React, { useState, useEffect } from "react";
import { Timer, Question } from "../components";

const ExamComponent = ({ examId }) => {
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    loadExam();
  }, [examId]);

  const handleSubmit = async () => {
    try {
      await api.post(`/exams/${examId}/submit`, { answers });
      // Redirecionar para página de resultados
    } catch (error) {
      console.error("Erro ao enviar prova:", error);
    }
  };

  return (
    <div className="exam-container">
      <Timer timeRemaining={timeRemaining} onTimeUp={handleSubmit} />
      <Question
        data={exam?.questions[currentQuestion]}
        onAnswer={(answer) =>
          setAnswers({ ...answers, [currentQuestion]: answer })
        }
      />
      <div className="navigation-buttons">
        {currentQuestion > 0 && (
          <button onClick={() => setCurrentQuestion((prev) => prev - 1)}>
            Anterior
          </button>
        )}
        {currentQuestion < exam?.questions.length - 1 ? (
          <button onClick={() => setCurrentQuestion((prev) => prev + 1)}>
            Próxima
          </button>
        ) : (
          <button onClick={handleSubmit}>Finalizar</button>
        )}
      </div>
    </div>
  );
};
