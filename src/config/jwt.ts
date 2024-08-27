import jwt, {
  SignOptions,
  VerifyOptions,
  JwtPayload,
  Secret,
} from "jsonwebtoken";

interface JwtPayloadCustom extends JwtPayload {
  [key: string]: any; // Permite adicionar propriedades personalizadas ao payload
}

const JWT_SECRET: Secret = process.env.TOKEN_SECRET || "BOLINHA";

export const signToken = (
  payload: JwtPayloadCustom,
  options: SignOptions = {}
): string => {
  const signOptions: SignOptions = {
    algorithm: "HS256",
    expiresIn: "365d",
    ...options,
  };

  return jwt.sign(payload, JWT_SECRET, signOptions);
};

export const verifyToken = (
  token: string,
  options: VerifyOptions = {}
): JwtPayloadCustom | null => {
  try {
    return jwt.verify(token, JWT_SECRET, options) as JwtPayloadCustom;
  } catch (error) {
    console.error("JWT verification error:", (error as Error).message);
    return null;
  }
};
