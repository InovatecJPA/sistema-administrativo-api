import mailConfig from "../../../config/mailConfig";

const randomGuesPassword = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const createDefaultEmailConfig = (email: string) => {
  return {
    email: email,
    subject: "Fator Político - Email de ativação de conta",
    message: "Sua senha de acesso ao Fator Político está disponível",
    template: "activateAccount",
    variables: {
      link: `${mailConfig.baseUrl}`,
      imageUrl: `${mailConfig.baseUrl}`,
      user: undefined,
      userName: undefined,
      password: undefined,
    },
  };
};

const helper = {
  createDefaultEmailConfig,
  randomGuesPassword,
};

export default helper;
