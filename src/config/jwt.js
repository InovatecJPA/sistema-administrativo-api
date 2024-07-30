import jsonwebtoken from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "HESTIA";

/**
 * Signs the given values into a JWT.
 *
 * @param {object} values - The payload to sign.
 * @returns {string} - The signed JWT.
 */
const sign = (values = {}) => {
	try {
		return jsonwebtoken.sign(values, JWT_SECRET, {
			algorithm: "HS256",
			expiresIn: "365d",
		});
	} catch (error) {
		throw new Error("Error signing JWT");
	}
};

const verify = (token) => {
	try {
		return jsonwebtoken.verify(token, JWT_SECRET);
	} catch (error) {
		throw new Error("Error verifying JWT");
	}
};

const jwt = {
	sign,
	verify,
};

export default jwt;
