import { Request, Response, NextFunction } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

export default auth;
