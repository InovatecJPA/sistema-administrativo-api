const path = require("path");
const fg = require("fast-glob");

// Defina o padrão de busca para encontrar os arquivos
const pattern = path.join(__dirname, "/migrations/*.ts");

// Use fast-glob para encontrar os arquivos
fg(pattern)
	.then((files) => {
		console.log("Files found:", files);
	})
	.catch((err) => {
		console.error("Error occurred:", err);
	});
