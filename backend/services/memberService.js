// backend/services/memberService.js

const pool = require("../config/db");

class MemberService {
  static async validateMemberData(memberData) {
    const errors = [];

    if (!memberData.name) {
      errors.push("Nome é obrigatório");
    }

    if (memberData.email) {
      // Validar formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(memberData.email)) {
        errors.push("Email inválido");
      }
    }

    if (memberData.phone) {
      // Validar formato do telefone
      const phoneRegex = /^\d{10,11}$/;
      if (!phoneRegex.test(memberData.phone)) {
        errors.push("Telefone inválido");
      }
    }

    return errors;
  }

  static async formatMemberData(memberData) {
    return {
      ...memberData,
      birth_date: memberData.birth_date
        ? new Date(memberData.birth_date)
        : null,
      baptism_date: memberData.baptism_date
        ? new Date(memberData.baptism_date)
        : null,
    };
  }

  static async searchMembers(searchTerm, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM members 
      WHERE 
        name ILIKE $1 OR 
        email ILIKE $1 OR 
        phone ILIKE $1 
      ORDER BY name 
      LIMIT $2 OFFSET $3
    `;

    const result = await pool.query(query, [`%${searchTerm}%`, limit, offset]);
    return result.rows;
  }

  static async getMembersByBirthMonth(month) {
    const query = `
      SELECT * FROM members 
      WHERE EXTRACT(MONTH FROM birth_date) = $1 
      ORDER BY EXTRACT(DAY FROM birth_date)
    `;

    const result = await pool.query(query, [month]);
    return result.rows;
  }
}

module.exports = MemberService;
