const express = require("express");
const User = require("../models/users");

const router = express.Router();

router.post("/users", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log(req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ name, email, password, role });
    console.log(user);

    await user.save();

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ message: "No user found." });
  }
  return res.status(201).json({ message: "Logged In Successfully" });
});

module.exports = router;
