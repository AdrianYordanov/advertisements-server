// External
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
// Errors
import ForbiddenError from "../errors/forbiddenError";
// Constants
import { secretKey, userSessionInHours } from "./constants";

export const jwtGenerateToken = (
  userId: string,
  userHashedPassword: string
) => {
  return jwt.sign({ userId, userHashedPassword }, secretKey, {
    expiresIn: `${userSessionInHours}h`
  });
};

export const jwtAuthorization = (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const token = (req.headers.authorization || "").split(" ")[1];
    const verifiedUser = jwt.verify(token, secretKey);
    req.headers.UserId = (verifiedUser as { userId: string }).userId;
    next();
  } catch (err) {
    next(new ForbiddenError("User's jwt doesn't match."));
  }
};
