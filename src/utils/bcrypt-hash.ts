// External
import bcrpyt from "bcrypt";

export const bcryptHashPassword = (
  inputPassword: string,
  executor: (err: Error, hashedPassword: string) => void
) => {
  bcrpyt.hash(inputPassword, 10, executor);
};

export const bcryptComparePassword = (
  inputPassword: string,
  userHashedPassword: string
) => {
  return bcrpyt.compareSync(inputPassword, userHashedPassword);
};
