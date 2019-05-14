import CustomError from "./customError";

class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}

export default ForbiddenError;
