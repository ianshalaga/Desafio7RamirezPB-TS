import User from "./User";

interface dbUser extends User {
  _id: string;
}

export default dbUser;
