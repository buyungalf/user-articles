import User from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(StatusCodes.OK).json({ users });
};

export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(StatusCodes.OK).json({ user });
};

export const createUser = async (req, res) => {
  const { name, username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists)
    return res.status(400).json({ message: "Username already taken" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ name, username, password: hashedPassword });
  res
    .status(StatusCodes.CREATED)
    .json({ user: { id: user._id, name: user.name, username: user.username } });
};

export const updateUser = async (req, res) => {
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
  }

  const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).select("-password");
  res.status(StatusCodes.OK).json({ user: updated });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ message: "User deleted" });
};
