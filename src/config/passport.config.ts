import passport from "passport";
import passportLocal from "passport-local";
import { createHash, isValidPassword } from "../utils/passwordHashing";
import { usersModel } from "../dao/models/users.model";
import { Request } from "express";
import User from "../interfaces/User";
import dbUser from "../interfaces/dbUser";
import "dotenv/config";
import GitHubStrategy from "passport-github2";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
  // Register
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req: Request, username: string, password: string, done) => {
        try {
          const { email, firstName, lastName, age, rol } = req.body;
          const userExist = await usersModel.findOne({ email: username });
          if (userExist) {
            console.log("El usuario ya existe");
            return done(null, false); // User exist. No error.
          }
          const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: createHash(password),
            rol,
          };
          const result = await usersModel.create(newUser);
          return done(null, result); // User successfully added
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Login
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username: string, password: string, done) => {
        try {
          console.log("PASSPORT LOGIN");
          const user: User = await usersModel.findOne({ email: username });
          console.log(user);
          if (!user) return done(null, false);
          const valid = isValidPassword(user, password);
          console.log(valid);
          if (!valid) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // GitHub
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: githubClientId,
        clientSecret: githubClientSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user: User = await usersModel.findOne({
            email: profile._json.email,
          });
          if (!user) {
            const newUser = {
              firstName: profile._json.name || "firstName",
              lastName: profile._json.name || "lastName",
              email: profile.emails[0].value || "email",
              age: 0,
              // password: profile._json.email,
              password: " ",
              // rol: profile._json.type.toLowerCase(),
              rol: "user",
            };
            const result = await usersModel.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: dbUser, done) => {
    console.log("serialize");
    done(null, user._id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      console.log("deserialize");
      let user: dbUser = await usersModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
