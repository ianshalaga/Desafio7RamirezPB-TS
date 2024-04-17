import express, { Router } from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { dbURI } from "../utils/db";
import { rootPath } from "../utils/paths";
import passport from "passport";
import initializePassport from "../config/passport.config";

const middlewares = Router();

middlewares.use(express.urlencoded({ extended: true })); // Complex URLs format mapping
middlewares.use(express.static(`${rootPath}/public`)); // Serves static files from public folder
middlewares.use(express.json()); // Format JSON requests to JavaScript Object format (POST / PUT)

middlewares.use(cookieParser("secret")); // Cookies

middlewares.use(
  session({
    store: MongoStore.create({
      mongoUrl: dbURI,
      ttl: 15,
    }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
); // Sessions

// Passport
initializePassport();
middlewares.use(passport.initialize());
middlewares.use(passport.session());

export default middlewares;
