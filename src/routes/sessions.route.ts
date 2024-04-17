import { Router, Request, Response } from "express";
import User from "../interfaces/User";
import { usersModel } from "../dao/models/users.model";
import { failureStatus, successStatus } from "../utils/statuses";
import UserLogin from "../interfaces/UserLogin";

const sessionsRouter = Router();

// @@@@
sessionsRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const userExist = await usersModel.findOne({ email: user.email });
    if (userExist) {
      throw new Error("El email ya existe.");
    }
    const result = await usersModel.create({ ...user, rol: "user" });
    console.log(result);
    res.json(successStatus);
  } catch (error) {
    res.json(failureStatus(error.message));
  }
});

// @@@@
sessionsRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const credentialsError: string = "Error de credenciales";
    const userLogin: UserLogin = req.body;
    if (
      userLogin.email == "adminCoder@coder.com" &&
      userLogin.password == "adminCod3r123"
    ) {
      // Admin
      req.session.admin = {
        email: userLogin.email,
        rol: "admin",
      };
    } else {
      // User
      const user: User = await usersModel.findOne({ email: userLogin.email });
      if (!user) {
        return res
          .status(400)
          .send({ status: "error", error: credentialsError });
      }
      const validPassword: boolean =
        userLogin.password == user.password ? true : false;
      if (!validPassword) {
        return res
          .status(400)
          .send({ status: "error", error: credentialsError });
      }
      req.session.user = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        age: user.age,
        rol: "user",
      };
    }
    res.json(successStatus);
  } catch (error) {
    res.json(failureStatus(error.message));
  }
});

// @@@@
sessionsRouter.post("/logout", async (req: Request, res: Response) => {
  req.session.destroy((error) => {
    if (!error) {
      res.json(successStatus);
    } else {
      res.json(failureStatus(error.message));
    }
  });
});

export default sessionsRouter;
