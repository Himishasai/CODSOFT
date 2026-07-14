const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  readJSON,
  writeJSON,
} = require("../utils/fileHelper");

const usersFile = path.join(__dirname, "../data/users.json");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const users = readJSON(usersFile);

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length
        ? Math.max(...users.map((u) => u.id)) + 1
        : 1,
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    writeJSON(usersFile, users);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Login User
const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const users = readJSON(usersFile);

    const user = users.find(
      (u) => u.email === email
    );

    if (!user) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  registerUser,
  loginUser,
};