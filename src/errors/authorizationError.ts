import CustomError from "./customError";

class AuthorizationError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

export default AuthorizationError;
