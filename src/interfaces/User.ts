import UserLogin from "./UserLogin";

interface User extends UserLogin {
  firstName: string;
  lastName: string;
  age: number;
  rol: string;
}

export default User;
