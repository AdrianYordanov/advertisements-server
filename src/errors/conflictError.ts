import CustomError from "./customError";

class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409);
  }
}

export default ConflictError;
