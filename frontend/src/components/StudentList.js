import React, { useState, useEffect } from "react";
import api from "../services/api";

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error loading students:", error);
    }
  };

  return (
    <div className="student-list">
      <h2>Lista de Alunos</h2>
      <table>
        <thead>
          <tr>
            <th>Matrícula</th>
            <th>Nome</th>
            <th>Turma</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.registration}</td>
              <td>{student.name}</td>
              <td>{student.class}</td>
              <td>
                <button onClick={() => handleEdit(student._id)}>Editar</button>
                <button onClick={() => handleDelete(student._id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
