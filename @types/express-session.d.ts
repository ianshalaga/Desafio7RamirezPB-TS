import UserSession from "../src/interfaces/UserSession";
import AdminSession from "../src/interfaces/AdminSession";

declare module "express-session" {
  interface Session {
    user: UserSession;
    admin: AdminSession;
  }
}
