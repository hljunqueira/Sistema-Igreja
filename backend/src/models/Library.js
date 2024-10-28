const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true },
  categories: [String],
  format: { type: String, enum: ["physical", "ebook", "pdf"] },
  available: Boolean,
  location: String,
  digitalUrl: String,
  borrowHistory: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      borrowDate: Date,
      returnDate: Date,
      returned: Boolean,
    },
  ],
});

// backend/src/services/LibraryService.js
class LibraryService {
  async borrowBook(bookId, studentId) {
    const book = await Book.findById(bookId);
    if (!book.available) {
      throw new Error("Livro não disponível");
    }

    book.available = false;
    book.borrowHistory.push({
      student: studentId,
      borrowDate: new Date(),
      returned: false,
    });

    await book.save();
    return book;
  }

  async returnBook(bookId, studentId) {
    const book = await Book.findById(bookId);
    const borrowRecord = book.borrowHistory.find(
      (record) => record.student.toString() === studentId && !record.returned
    );

    if (borrowRecord) {
      borrowRecord.returned = true;
      borrowRecord.returnDate = new Date();
      book.available = true;
      await book.save();
    }
  }
}
