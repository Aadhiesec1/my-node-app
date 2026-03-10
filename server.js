require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Fake users with hashed passwords
const users = [
  {
    username: "admin",
    name: "Admin",
    password: bcrypt.hashSync("admin123", 10)
  },
  {
    username: "user1",
    name: "User1",
    password: bcrypt.hashSync("user123", 10)
  },
  {
    username: "user2",
    name: "User2",
    password: bcrypt.hashSync("test123", 10)
  }
];

// Home redirect
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Login page
app.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Login logic
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);

  if (!user) {
    return res.render("login", { error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.render("login", { error: "Invalid credentials" });
  }

  req.session.user = {
    username: user.username,
    name: user.name
  };

  res.redirect("/profile");
});

// Auth middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

// Profile
app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.session.user });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
