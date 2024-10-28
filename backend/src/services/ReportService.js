const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

class ReportService {
  async generateAcademicReport(studentId, period) {
    const doc = new PDFDocument();
    const student = await Student.findById(studentId)
      .populate("grades")
      .populate("attendance");

    // Configuração do cabeçalho do relatório
    doc.fontSize(20).text("Relatório Acadêmico", {
      align: "center",
    });

    // Dados do aluno
    doc.fontSize(12).text(`Aluno: ${student.name}`);
    doc.text(`Matrícula: ${student.registration}`);

    // Notas e frequência
    student.grades.forEach((grade) => {
      doc.text(`Disciplina: ${grade.course.name}`);
      doc.text(`Média Final: ${grade.finalGrade}`);
    });

    return doc;
  }

  async generateFinancialReport(filters) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Relatório Financeiro");

    // Configuração das colunas
    worksheet.columns = [
      { header: "Data", key: "date" },
      { header: "Descrição", key: "description" },
      { header: "Valor", key: "amount" },
      { header: "Status", key: "status" },
    ];

    // Adicionar dados
    const transactions = await Payment.find(filters);
    transactions.forEach((transaction) => {
      worksheet.addRow({
        date: transaction.date,
        description: transaction.description,
        amount: transaction.amount,
        status: transaction.status,
      });
    });

    return workbook;
  }
}

module.exports = new ReportService();
