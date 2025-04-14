const express = require("express");
const app = express();
const { createServer } = require("http");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes/authRoutes.js");
const postRoutes = require("./routes/postRoutes/postRoutes.js");
const chatRoutes = require("./routes/chatRoutes/chatRoutes.js");
const profileRoute = require("./routes/profileRoute/profileRoute.js");
const path = require("path");
const cookieParser = require("cookie-parser");
app.use(express.json());

app.use(cors());


app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "..", "views"));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("auth/register.ejs");
});
app.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});


app.use("/api/auth", authRoutes);
app.use("/home", postRoutes);
app.use("/chats", chatRoutes);
app.use("/profile", profileRoute);

module.exports = app;
