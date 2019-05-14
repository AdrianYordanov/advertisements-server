// External
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
// DB
import db from "../config/db";
// Errors
import InternalServerError from "../errors/internalServerError";
import AuthorizationError from "../errors/authorizationError";
import ConflictError from "../errors/conflictError";
import CustomError from "../errors/customError";
// Authentication
import { jwtGenerateToken } from "../utils/jwt-auth";
// Passwords hashing
import {
  bcryptHashPassword,
  bcryptComparePassword
} from "../utils/bcrypt-hash";

export const registerUser = async (
  req: Request,
  res: Response,
  next: (err: CustomError) => void
) => {
  const database = await db;
  const usersCollection = database.collection("users");
  const { username, password } = req.body;
  const users = await usersCollection.find({ username }).toArray();
  if (users.length > 0) {
    return next(new ConflictError(`Username "${username}" already exists.`));
  }

  bcryptHashPassword(password, async (err, hashedPassword) => {
    if (err) {
      return next(
        new InternalServerError("Server couldn't hash the password.")
      );
    }

    const userToBeInserted = {
      _id: new ObjectId(),
      username,
      password: hashedPassword
    };
    await usersCollection.insertOne(userToBeInserted);
    res.status(201).send({
      message: "User created successfuly.",
      username: userToBeInserted.username,
      token: jwtGenerateToken(
        userToBeInserted._id.toHexString(),
        hashedPassword
      )
    });
  });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: (err: CustomError) => void
) => {
  const { username, password } = req.body;
  const database = await db;
  const usersCollection = database.collection("users");
  const foundUser = await usersCollection.findOne({ username });
  if (!foundUser) {
    return next(new AuthorizationError(`User "${username}" doesn't exists.`));
  }

  if (!bcryptComparePassword(password, foundUser.password)) {
    return next(new AuthorizationError(`Incorrect password.`));
  }

  res.status(201).send({
    message: "User was logged successfuly.",
    username: foundUser.username,
    token: jwtGenerateToken(foundUser._id, foundUser.password)
  });
};

export const checkUser = (req: Request, res: Response, next: Function) => {
  res.status(200).send({
    message: "User is successfuly authorized."
  });
};
