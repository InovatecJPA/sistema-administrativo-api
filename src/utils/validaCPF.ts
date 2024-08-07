export default class CpfValidator {
	constructor(invalidatedCpf: string) {
		Object.defineProperty(this, "cpf", {
			writable: false,
			enumerable: true,
			configurable: false,
			value: invalidatedCpf ? invalidatedCpf.replace(/\D+/g, "") : "",
		});
	}

	private static isSequence(cpfDigitsString: string) {
		return cpfDigitsString.charAt(0).repeat(11) === cpfDigitsString;
	}

	private static generateDigit(cpfWithoutDigits: string) {
		let total: number = 0;
		let pointer: number = cpfWithoutDigits.length + 1;

		for (let cpfNumbers of cpfWithoutDigits) {
			total += pointer * Number(cpfNumbers);
			pointer--;
		}

		const digit: number = 11 - (total % 11);
		return digit <= 9 ? String(digit) : "0";
	}

	private static generateValidCpf(cpfDigitsString: string) {
		const cpfWithoutDigits: string = cpfDigitsString.slice(0, -2);
		const firstValidatorDigit: string = CpfValidator.generateDigit(cpfWithoutDigits);
		const secondValidatorDigit: string = CpfValidator.generateDigit(cpfWithoutDigits + firstValidatorDigit);
		return cpfWithoutDigits + firstValidatorDigit + secondValidatorDigit;
	}

	static validate(cpf: string) {
		if (!cpf) return false;
		if (typeof cpf !== "string") return false;
		if (cpf.length !== 11) return false;
		if (CpfValidator.isSequence(cpf)) return false;
		let validCpf = CpfValidator.generateValidCpf(cpf);

		return validCpf === cpf;
	}
}