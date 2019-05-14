// External
import { Request, Response } from "express";
import fs from "fs";
import { ObjectId } from "mongodb";

// DB
import db from "../config/db";

// Errors
import InternalServerError from "../errors/internalServerError";
import AuthorizationError from "../errors/authorizationError";
import NotFoundError from "../errors/notFoundError";
import BadRequestError from "../errors/badRequest";

export const getPubilcAdvertisements = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const database = await db;
  const advertisementsCollection = database.collection("advertisements");
  const advertisements = await advertisementsCollection.find().toArray();
  res.status(200).send({
    message: "Advertisements were accessed successfuly.",
    advertisements
  });
};

export const getUserAdvertisements = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const { UserId } = req.headers;
  const database = await db;
  const usersCollection = database.collection("users");
  const foundUser = await usersCollection.findOne(
    new ObjectId(UserId as string)
  );
  if (!foundUser) {
    return next(
      new AuthorizationError(`User with id: "${UserId}" doesn't exists.`)
    );
  }

  const advertisementsCollection = database.collection("advertisements");
  const userAdvertisements = await advertisementsCollection
    .find({ creatorId: new ObjectId(UserId as string) })
    .toArray();
  res.status(200).send({
    message: "My advertisements were accessed successfuly.",
    advertisements: userAdvertisements
  });
};

export const postAdvertisement = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const { UserId } = req.headers;
  const database = await db;
  const usersCollection = database.collection("users");
  const foundUser = await usersCollection.findOne(
    new ObjectId(UserId as string)
  );
  if (!foundUser) {
    return next(
      new AuthorizationError(`User with id: "${UserId}" doesn't exists.`)
    );
  }

  const advertisementToInsert = {
    _id: new ObjectId(),
    title: req.body.title,
    price: +req.body.price,
    description: req.body.description,
    imagePath: req.file.path,
    image: `data:image/jpeg;base64, ${fs.readFileSync(
      req.file.path,
      "base64"
    )}`,
    owner: foundUser.username,
    creatorId: foundUser._id
  };
  const advertisementsCollection = database.collection("advertisements");
  const createdAdvertisement = await advertisementsCollection.insertOne(
    advertisementToInsert
  );
  res.status(201).send({
    message: "Advertisement was created successfuly.",
    advertisement: createdAdvertisement
  });
};

export const deleteAdvertisement = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const { UserId } = req.headers;
  const advertisementId = req.params.advertisementId;
  const database = await db;
  const usersCollection = database.collection("users");
  const foundUser = await usersCollection.findOne(
    new ObjectId(UserId as string)
  );
  if (!foundUser) {
    return next(
      new AuthorizationError(`User with id: "${UserId}" doesn't exists.`)
    );
  }

  const advertisementsCollection = database.collection("advertisements");
  const userAdvertisement = await advertisementsCollection.findOne(
    new ObjectId(advertisementId)
  );
  if (!userAdvertisement) {
    return next(
      new NotFoundError(
        `Advertisement with id "${advertisementId}" doesn't exists.`
      )
    );
  }

  fs.unlink(userAdvertisement.imagePath, err => {
    if (err) {
      console.log("Failed to delete local image: " + err);
    } else {
      console.log("Successfully deleted local image.");
    }
  });

  await advertisementsCollection.deleteOne({
    _id: new ObjectId(advertisementId)
  });
  res.status(200).send({
    message: `Advertisement was deleted successfuly.`
  });
};
