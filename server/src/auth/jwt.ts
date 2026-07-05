import jwt from "jsonwebtoken";
import { config } from "../config.js";

interface TokenPayload {
  userId: string;
}

export const signToken = (userId: string): string =>
  jwt.sign({ userId } satisfies TokenPayload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, config.jwtSecret) as TokenPayload;
