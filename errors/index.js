import CustomAPIError from "./custom-api.js";
import UnauthenticatedError from "./unauthenticated.js";
import NotFoundError from "./not-found.js";
import BadRequestError from "./bad-request.js";
import UnauthorizedError from "./unauthorized.js";

const errors = {
  CustomAPIError,
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
};

export default errors;
