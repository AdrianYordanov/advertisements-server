// External
import { Request, Response } from "express";

// Routes
import usersRoutes from "./users";
import advertisementsRoutes from "./advertisements";

// Errors
import CustomError from "../../errors/customError";
import NotFoundError from "../../errors/notFoundError";

export default (app: { use: Function }) => {
  try {
    app.use("/users", usersRoutes);
    app.use("/advertisements", advertisementsRoutes);
    // Non-matching path.
    app.use((req: Request, res: Response, next: Function) => {
      next(new NotFoundError("Could not match this path."));
    });
    // Route error handling.
    app.use((err: CustomError, req: Request, res: Response, next: Function) => {
      res.status(err.statusCode).json({
        message: err.message
      });
    });
  } catch (error) {
    console.log(error);
  }
};
