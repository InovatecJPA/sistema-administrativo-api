import axios from "axios";

export default async function validateCep(cep: string): Promise<boolean> {
	cep = cep ? cep.replace(/\D+/g, "") : "";

	if (cep.length !== 8) {
		return false;
	}

	const result = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

	if (result.status == 200 && !result.data.erro) {
		return true;
	}

	return false;
}
