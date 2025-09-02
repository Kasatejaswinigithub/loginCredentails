const express = require("express");
const app = express();
const hbs = require("hbs");
const collection = require("./mongodb");
const path = require("path");

const templatePath = path.join(__dirname, "../templates");
app.use(express.static("public"));

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  res.render("login", { error: null });
});

app.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});


app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    password: req.body.password,
  };
  try {
    const existingUser = await collection.findOne({ name: req.body.name });
    if (existingUser) {
      return res.render("signup", { error: "User already exists" });
    }
    await collection.insertMany([data]);
    res.render("home", { user: data.name });
  } catch (err) {
    res.render("signup", { error: "Error while signing up: " + err });
  }
});


app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });
    if (!check) {
      return res.render("login", { error: "User not found" });
    }
    if (check.password === req.body.password) {
      res.render("home", { user: check.name });
    } else {
      res.render("login", { error: "Incorrect password" });
    }
  } catch (err) {
    res.render("login", { error: "Wrong details: " + err });
  }
});

app.listen(3000, () => {
  console.log("port connected");
});
