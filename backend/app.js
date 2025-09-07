const express = require("express");
const path = require("path");
const rootDir = require("./utils/pathUtils");
const session = require("express-session");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");

const DB_path = process.env.MONGO_URL;
const port = process.env.PORT;

const cors = require("cors");

const authRouter = require("../backend/routes/authRouter");
const hostRouter = require("../backend/routes/hostRouter");
const adminRouter = require("../backend/routes/adminRouter");

const app = express();

const store = new MongoDBStore({
  uri: DB_path,
  collection: "sessions",
});

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.static(path.join(rootDir, "public")));
app.use(express.urlencoded());
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  req.userId = req.session.userId;
  req.loginType = req.session.loginType;
  next();
});

app.use(
  "/uploads",
  require("cors")(),
  express.static(path.join(__dirname, "uploads"))
);

app.use("/auth", authRouter);
app.use("/host", hostRouter);
app.use("/admin", adminRouter);

app.use(express.static(path.join(rootDir, "../frontend/OptiRoll")));

app.get( (req, res) => {
  res.sendFile(path.join(rootDir, "../frontend/OptiRoll/index.html"));
});

mongoose
  .connect(DB_path)
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server Running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("error connecting to server", err);
  });
