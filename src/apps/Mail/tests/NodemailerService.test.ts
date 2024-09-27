import { NodemailerService } from "../services/NodemailerService";
import { MailContext } from "../models/EmailContext";

import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";

jest.mock("nodemailer");

describe("NodemailerService", () => {
  let transporterMock: any;
  let nodemailerService: NodemailerService;

  beforeEach(() => {
    transporterMock = {
      sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
        callback(null, { response: "Email enviado" });
      }),
      use: jest.fn(), // Mock da função `use`
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(transporterMock);

    nodemailerService = new NodemailerService();
  });

  it("deve enviar um email usando o Nodemailer", async () => {
    const context: MailContext = { link: "https://example.com" };
    const response = await nodemailerService.sendMail(
      "test@example.com",
      "Assunto de Teste",
      "Mensagem de Teste",
      "resetPassword",
      context
    );

    expect(response).toBe("Email enviado");
    expect(transporterMock.sendMail).toHaveBeenCalled();
  });

  it("deve configurar o Nodemailer corretamente", () => {
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: expect.any(String),
        port: expect.any(Number),
        auth: expect.objectContaining({
          user: expect.any(String),
          pass: expect.any(String),
        }),
      })
    );

    expect(transporterMock.use).toHaveBeenCalledWith(
      "compile",
      expect.anything()
    ); // Verifica se o método `use` foi chamado
  });
});
