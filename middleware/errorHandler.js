import { StatusCodes } from "http-status-codes";

export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name || "UnknownError"}: ${err.message}`);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({ message });
};
