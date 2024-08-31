import mailConfig from "../../../config/mailConfig";

const createDefaultEmailConfig = (email: string) => {
  return {
    email: email,
    subject: "Fator Político - Email de ativação de conta",
    message: "Sua senha de acesso ao Fator Político está disponível",
    template: "resetPassword",
    variables: {
      link: `${mailConfig.baseUrl}`,
      user: undefined,
      userName: undefined,
      password: undefined,
    },
  };
};

const helper = {
  createDefaultEmailConfig
};

export default helper;
