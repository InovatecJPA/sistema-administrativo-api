import jwt, {
  SignOptions,
  VerifyOptions,
  JwtPayload,
  Secret,
} from "jsonwebtoken";

interface JwtPayloadCustom extends JwtPayload {
  [key: string]: any;
}

const JWT_SECRET: Secret = process.env.TOKEN_SECRET || "BOLINHA";

export const signToken = (
  payload: JwtPayloadCustom,
  _expiresIn: string = "365d",
  options: SignOptions = {}
): string => {
  const signOptions: SignOptions = {
    algorithm: "HS256",
    expiresIn: _expiresIn,
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
    console.error(
      "JWT verification error (jwt.ts - verifyToken):",
      (error as Error).message
    );
    return null;
  }
};
