const { Router } = require("express");
const User = require("../models/user");

const router = Router();

router.get("/", (req, res) => {
  res.render("home", { title: "Homepage" });
});

router.get("/signin", (req, res) => {
  res.render('signin', { title: 'Signin' });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: 'Signup' });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
      title: "Signin"
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

module.exports = router;
