const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  type: { type: String, enum: ["tuition", "fee", "other"] },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "paid", "overdue"] },
  paymentDate: Date,
  paymentMethod: String,
  transactionId: String,
});

module.exports = mongoose.model("Payment", paymentSchema);

// backend/src/services/PaymentService.js
class PaymentService {
  async generateMonthlyInvoices() {
    // Lógica para gerar faturas mensais
  }

  async processPayment(paymentData) {
    // Integração com gateway de pagamento
  }

  async generateFinancialReport(filters) {
    // Geração de relatórios financeiros
  }
}
