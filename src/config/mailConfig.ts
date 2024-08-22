const mailConfig = {
  host: process.env.EMAIL_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.EMAIL_PORT, 10) || 465,
  secure: process.env.EMAIL_STARTTLS === "true" ? false : true,
  user: process.env.EMAIL_USER || "example@mail.com",
  pass: process.env.EMAIL_PASSWORD || "your_password",
  baseUrl: process.env.BASE_URL || "http://localhost:3000",
  apiUrl: process.env.API_URL || "http://localhost:3500",
};

export default mailConfig;
