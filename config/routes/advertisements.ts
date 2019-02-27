// External
import express from "express";
// Config

import upload from "../multer";
// Authorization

import { jwtAuthorization } from "../../utils/jwt-auth";

// Controllers
import {
  getPubilcAdvertisements,
  getUserAdvertisements,
  postAdvertisement,
  deleteAdvertisement
} from "../../controllers/advertisements";

const router = express();

router.get("/", getPubilcAdvertisements);
router.get("/my", jwtAuthorization, getUserAdvertisements);
router.post("/", jwtAuthorization, upload.single("image"), postAdvertisement);
router.delete("/:advertisementId", jwtAuthorization, deleteAdvertisement);

export default router;
