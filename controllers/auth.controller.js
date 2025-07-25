import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import errors from "../errors/index.js";
import { StatusCodes } from "http-status-codes";

const createJWT = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { name, username, password } = req.body;

    if (!name || !username || !password) {
      throw new errors.BadRequestError(
        "Please provide name, username, and password"
      );
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      throw new errors.BadRequestError("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
    });

    const token = createJWT({ id: user._id });

    res.status(StatusCodes.CREATED).json({ token });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new errors.BadRequestError("Please provide username and password");
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new errors.UnauthenticatedError("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new errors.UnauthenticatedError("Invalid credentials");
    }

    const token = createJWT({ id: user._id });

    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
