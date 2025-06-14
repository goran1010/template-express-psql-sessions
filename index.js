import express from "express";
import session from "express-session";
import passport from "./auth/passport.js";
import connectPgSimple from "connect-pg-simple";
const PgSession = connectPgSimple(session);
import pool from "./db/pool.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
import flash from "connect-flash";
app.use(flash());

app.use(express.urlencoded({ extended: true }));

import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

import indexRouter from "./routes/indexRouter.js";

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", indexRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message || "500 Internal server error");
});

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
