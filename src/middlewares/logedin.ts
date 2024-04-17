import { Request, Response, NextFunction } from "express";

function logedin(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  next();
}

export default logedin;
