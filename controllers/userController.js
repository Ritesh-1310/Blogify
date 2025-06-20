const User = require("../models/user");

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  const user = await User.create({ fullName, email, password });
  res.status(201).json({ message: "User created", user });
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None", 
    }).json({ message: "Login successful" });

  } catch {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
};

exports.getProfile = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  res.json(req.user);
};


