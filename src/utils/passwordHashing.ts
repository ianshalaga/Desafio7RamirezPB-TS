import bcrypt from "bcrypt";
import User from "../interfaces/User";

export function createHash(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export function isValidPassword(user: User, password: string) {
  return bcrypt.compareSync(password, user.password);
}
