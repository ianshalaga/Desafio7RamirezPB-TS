import { Router, Request, Response } from "express";
import { failureStatus, successStatus } from "../utils/statuses";
import passport from "passport";
import adminAuth from "../middlewares/adminAuth";

const sessionsRouter = Router();

// @@@@
// sessionsRouter.post("/register", async (req: Request, res: Response) => {
//   try {
//     const user: User = req.body;
//     const userExist = await usersModel.findOne({ email: user.email });
//     if (userExist) {
//       throw new Error("El email ya existe.");
//     }
//     const result = await usersModel.create({
//       ...user,
//       password: createHash(user.password),
//       rol: "user",
//     });
//     console.log(result);
//     res.json(successStatus);
//   } catch (error) {
//     res.json(failureStatus(error.message));
//   }
// });

sessionsRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req: Request, res: Response) => {
    res.status(201).json(successStatus);
  }
);

sessionsRouter.get("/failregister", async (req: Request, res: Response) => {
  console.log("error");
  res.json(failureStatus("Error al registrar el usuario."));
});

// @@@@
// sessionsRouter.post("/login", async (req: Request, res: Response) => {
//   try {
//     const credentialsError: string = "Error de credenciales";
//     const userLogin: UserLogin = req.body;
//     if (
//       userLogin.email == "adminCoder@coder.com" &&
//       userLogin.password == "adminCod3r123"
//     ) {
//       // Admin
//       req.session.admin = {
//         email: userLogin.email,
//         rol: "admin",
//       };
//     } else {
//       // User
//       const user: User = await usersModel.findOne({ email: userLogin.email });
//       if (!user) {
//         return res
//           .status(400)
//           .send({ status: "error", error: credentialsError });
//       }
//       if (!isValidPassword(user, userLogin.password)) {
//         return res
//           .status(403)
//           .send({ status: "error", error: credentialsError });
//       }
//       req.session.user = {
//         name: `${user.firstName} ${user.lastName}`,
//         email: user.email,
//         age: user.age,
//         rol: user.rol,
//       };
//     }
//     res.json(successStatus);
//   } catch (error) {
//     res.json(failureStatus(error.message));
//   }
// });

sessionsRouter.post(
  "/login",
  adminAuth,
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req: Request, res: Response) => {
    if (!req.user)
      return res.status(400).json(failureStatus("Error de credenciales."));
    req.session.user = {
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      age: req.user.age,
      rol: req.user.rol,
    };
    res.status(200).json(successStatus);
  }
);

sessionsRouter.get("/faillogin", async (req: Request, res: Response) => {
  res.json(failureStatus("Login fail."));
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

// @@@@
sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req: Request, res: Response) => {}
);
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    console.log(req.user);
    req.session.user = {
      name: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      age: req.user.age,
      rol: req.user.rol,
    };
    console.log(req.session.user);
    res.redirect("/products");
  }
);

export default sessionsRouter;
