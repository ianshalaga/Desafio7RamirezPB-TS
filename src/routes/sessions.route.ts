import { Router, Request, Response } from "express";
import User from "../interfaces/User";
import { usersModel } from "../dao/models/users.model";
import { failureStatus, successStatus } from "../utils/statuses";
import UserLogin from "../interfaces/UserLogin";
import { createHash, isValidPassword } from "../utils/passwordHashing";

const sessionsRouter = Router();

// @@@@
sessionsRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const userExist = await usersModel.findOne({ email: user.email });
    if (userExist) {
      throw new Error("El email ya existe.");
    }
    const result = await usersModel.create({
      ...user,
      password: createHash(user.password),
      rol: "user",
    });
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
      if (!isValidPassword(user, userLogin.password)) {
        return res
          .status(403)
          .send({ status: "error", error: credentialsError });
      }
      req.session.user = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        age: user.age,
        rol: user.rol,
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
