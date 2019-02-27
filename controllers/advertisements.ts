// External
import { Request, Response } from "express";
import mongoose from "mongoose";
import fs from "fs";

// Models
import Advertisement from "../models/advertisements";
import User from "../models/users";

// Errors
import InternalServerError from "../errors/internalServerError";
import AuthorizationError from "../errors/authorizationError";
import NotFoundError from "../errors/notFoundError";

export const getPubilcAdvertisements = (
  req: Request,
  res: Response,
  next: Function
) => {
  Advertisement.find()
    .exec()
    .then(advertisements => {
      res.status(200).send({
        message: "Advertisements were accessed successfuly.",
        advertisements
      });
    })
    .catch(err => {
      return next(new NotFoundError("The advertisement were not found."));
    });
};

export const postAdvertisement = (
  req: Request,
  res: Response,
  next: Function
) => {
  const userId = req.headers.UserId;
  User.findById(userId)
    .exec()
    .then(foundUser => {
      if (!foundUser) {
        return next(
          new AuthorizationError(`User with id: "${userId}" doesn't exists.`)
        );
      }

      const advertisement = new Advertisement({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        imagePath: req.file.path,
        image: `data:image/jpeg;base64, ${fs.readFileSync(
          req.file.path,
          "base64"
        )}`,
        owner: foundUser.username,
        creatorId: foundUser._id
      });
      advertisement
        .save()
        .then(createdAdvertisement => {
          res.status(201).send({
            message: "Advertisement was created successfuly.",
            advertisement: createdAdvertisement
          });
        })
        .catch(err => {
          return next(
            new InternalServerError("Problem occurs during searching the user.")
          );
        });
    });
};

export const deleteAdvertisement = (
  req: Request,
  res: Response,
  next: Function
) => {
  const advertisementId = req.params.advertisementId;
  const userId = req.headers.UserId;
  User.findById(userId)
    .exec()
    .then(foundUser => {
      if (!foundUser) {
        return next(
          new AuthorizationError(`User with id: "${userId}" doesn't exists.`)
        );
      }

      Advertisement.findById(advertisementId)
        .exec()
        .then(advertisement => {
          if (!advertisement) {
            return next(
              new NotFoundError(
                `Advertisement with id "${advertisementId}" doesn't exists.`
              )
            );
          }
          fs.unlink(advertisement.imagePath, err => {
            if (err) {
              console.log("Failed to delete local image: " + err);
            } else {
              console.log("Successfully deleted local image.");
            }
          });

          Advertisement.deleteOne({ _id: advertisementId })
            .exec()
            .then(docs => {
              res.status(200).send({
                message: `Advertisement was deleted successfuly.`
              });
            })
            .catch(err => {
              return next(
                new InternalServerError(
                  "Problem occurs during deleting the advertisement."
                )
              );
            });
        });
    })
    .catch(err => {
      return next(
        new InternalServerError("Problem occurs during searching the user.")
      );
    });
};

export const getUserAdvertisements = (
  req: Request,
  res: Response,
  next: Function
) => {
  const userId = req.headers.UserId;
  User.findById(userId)
    .exec()
    .then(foundUser => {
      if (!foundUser) {
        return next(
          new AuthorizationError(`User with id: "${userId}" doesn't exists.`)
        );
      }

      Advertisement.find({ creatorId: userId })
        .exec()
        .then(advertisements => {
          res.status(200).send({
            message: "My advertisements were accessed successfuly.",
            advertisements
          });
        })
        .catch(err => {
          return next(new NotFoundError("The advertisements were not found."));
        });
    })
    .catch(err => {
      return next(
        new InternalServerError("Problem occurs during searching the user.")
      );
    });
};
