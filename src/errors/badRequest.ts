import CustomError from "./customError";

class BadRequest extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export default BadRequest;
