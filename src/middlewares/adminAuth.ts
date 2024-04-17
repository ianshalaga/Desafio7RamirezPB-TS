import { Request, Response, NextFunction } from "express";
import { successStatus } from "../utils/statuses";

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password == "adminCod3r123") {
    req.session.admin = {
      email: email,
      rol: "admin",
    };
    return res.status(200).json(successStatus);
  }
  next();
}

export default adminAuth;
