const mailConfig = {
	host: process.env.EMAIL_HOST || "smtp.hostinger.com",
	port: process.env.EMAIL_PORT || "587",
	secure: process.env.EMAIL_STARTTLS || true,
	auth: {
		user: process.env.EMAIL_USER || "",
		pass: process.env.EMAIL_PASSWORD || "",
	},
	baseUrl: process.env.BASE_URL || "http://localhost:3000",
	apiUrl: process.env.API_URL || "http://localhost:3010",
};

const validateConfig = (config) => {
	const requiredFields = [
		{ key: "host", value: config.host },
		{ key: "port", value: config.port },
		{ key: "user", value: config.auth.user },
		{ key: "pass", value: config.auth.pass },
	];

	const missingFields = requiredFields.filter((field) => !field.value);
	if (missingFields.length > 0) {
		throw new Error(
			`Campos de configuração obrigatórios ausentes: ${missingFields
				.map((field) => field.key)
				.join(", ")}`
		);
	}
};

validateConfig(mailConfig);

export default mailConfig;
