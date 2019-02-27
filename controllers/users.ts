// External
import { Request, Response } from "express";
import mongoose from "mongoose";
// Models
import User from "../models/users";
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

export const registerUser = (
  req: Request,
  res: Response,
  next: (err: CustomError) => void
) => {
  const inputUsername = req.body.username;
  const inputPassword = req.body.password;
  User.find({ username: inputUsername })
    .exec()
    .then(users => {
      if (users.length > 0) {
        return next(
          new ConflictError(`Username "${inputUsername}" already exists.`)
        );
      }

      bcryptHashPassword(inputPassword, (err, hashedPassword) => {
        if (err) {
          return next(
            new InternalServerError("Server couldn't hash the password.")
          );
        }

        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          username: inputUsername,
          password: hashedPassword
        });
        user
          .save()
          .then(createdUser => {
            res.status(201).send({
              message: "User created successfuly.",
              username: createdUser.username,
              token: jwtGenerateToken(createdUser._id, hashedPassword)
            });
          })
          .catch(err => {
            return next(new InternalServerError("User wasn't created."));
          });
      });
    })
    .catch(err => {
      return next(
        new InternalServerError("Problem occurs during searching the user.")
      );
    });
};

export const loginUser = (
  req: Request,
  res: Response,
  next: (err: CustomError) => void
) => {
  const inputUsername = req.body.username;
  const inputPassword = req.body.password;
  User.findOne({ username: inputUsername })
    .exec()
    .then(foundUser => {
      if (!foundUser) {
        return next(
          new AuthorizationError(`User "${inputUsername}" doesn't exists.`)
        );
      }

      if (!bcryptComparePassword(inputPassword, foundUser.password)) {
        return next(new AuthorizationError(`Incorrect password.`));
      }

      res.status(201).send({
        message: "User was logged successfuly.",
        username: foundUser.username,
        token: jwtGenerateToken(foundUser._id, foundUser.password)
      });
    })
    .catch(err => {
      return next(
        new InternalServerError("Problem occurs during searching the user.")
      );
    });
};

export const checkUser = (req: Request, res: Response, next: Function) => {
  res.status(200).send({
    message: "User is successfuly authorized."
  });
};
