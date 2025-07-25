import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      name: decoded.name,
      username: decoded.username,
    };

    next();
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Authentication failed" });
  }
};
