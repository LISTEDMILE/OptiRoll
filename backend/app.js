const express = require("express");
const path = require("path");
const rootDir = require("./utils/pathUtils");
const session = require("express-session");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const { default: mongoose } = require("mongoose");
const cors = require("cors");

const DB_path = process.env.MONGO_URL;
const port = process.env.PORT;

// require("../backend/face/faceEncod")

const authRouter = require("../backend/routes/authRouter");
const teacherRouter = require("./routes/teacherRouter");
const adminRouter = require("../backend/routes/adminRouter");
const studentRouter = require("../backend/routes/studentRouter");

const app = express();

// CORS setup (must be at the top, only once)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
// Explicitly handle preflight requests for all routes
app.options(
  /.*/,
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Session store
const store = new MongoDBStore({
  uri: DB_path,
  collection: "sessions",
});

app.set("trust proxy", 1);

// Static files for public assets
app.use(express.static(path.join(rootDir, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
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

// Attach session info to req
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  req.AdminUser = req.session.AdminUser;
  req.loginType = req.session.loginType;
  next();
});

// API routes
app.use("/auth", authRouter);
app.use("/teacher", teacherRouter);
app.use("/admin", adminRouter);
app.use("/student", studentRouter);

// Serve frontend (React build)
app.use(express.static(path.join(rootDir, "../frontend/OptiRoll")));

// Catch-all to serve React index.html for client-side routing
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(rootDir, "../frontend/OptiRoll/index.html"));
});

// Connect to MongoDB and start server
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
