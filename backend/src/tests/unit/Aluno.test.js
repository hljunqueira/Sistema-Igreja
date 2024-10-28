const Aluno = require("../models/Aluno");

describe("Aluno", () => {
  it("deve criar um novo aluno", async () => {
    const aluno = new Aluno({
      nome: "João",
      matricula: "123456",
      curso: "Engenharia de Computação",
    });

    await aluno.save();

    expect(aluno.nome).toBe("João");
    expect(aluno.matricula).toBe("123456");
    expect(aluno.curso).toBe("Engenharia de Computação");
  });
});
