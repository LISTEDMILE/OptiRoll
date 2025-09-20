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
const teacherRouter = require("./routes/teacherRouter");
const adminRouter = require("../backend/routes/adminRouter");
const studentRouter = require("../backend/routes/studentRouter");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Allow preflight for all routes
app.options("*", cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

const store = new MongoDBStore({
  uri: DB_path,
  collection: "sessions",
});

app.set("trust proxy", 1);



app.use(express.static(path.join(rootDir, "public")));
app.use(express.urlencoded({ extended: true }));
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
  req.AdminUser = req.session.AdminUser;
  req.loginType = req.session.loginType;
  next();
});


app.use("/auth", authRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);

app.use(express.static(path.join(rootDir, "../frontend/OptiRoll")));

app.get((req, res) => {
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
