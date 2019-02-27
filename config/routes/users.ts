// External
import express from "express";

// Authorization
import { jwtAuthorization } from "../../utils/jwt-auth";

// Controllers
import { registerUser, loginUser, checkUser } from "../../controllers/users";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/check", jwtAuthorization, checkUser);

export default router;
