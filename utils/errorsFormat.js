
const errorsVal = {
  EMAIL_REQUIRED: {
    message: 'Email is required',
    status: 400,
  },
  PASSWORD_REQUIRED: {
    message: 'Password is required',
    status: 400,
  },
  INVALIDE_EMAIL: {
    message: 'Invalid email',
    status: 401,
  },
  INVALIDE_EMAIL_OR_PASSWORD: {
    message: 'Invalid email or password',
    status: 401,
  },
  NAME_REQUIRED: {
    message: 'Name is required',
    status: 400,
  },
  INVALIDE_EMAIL_FORMAT: {
    message: 'Invalid email format',
    status: 400,
  },
  WEAK_PASSWORD: {
    message:
      'Password must be at least 9 characters and contain one lowercase, one uppercase, one number, and one symbol',
    status: 400,
  },
  INVALIDE_EMAIL_RESET: {
    message: 'Invalid email for password reset',
    status: 404,
  },
  TOKEN_REQUIRED: {
    message: 'Token is required',
    status: 400,
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    status: 404,
  },
  INVALID_TOKEN: {
    message: 'Invalid or expired token',
  },
  AGE_MUST_BE_NUMBER: {
    message: 'Age must be a number',
    status: 400,
  },
  INVALIDE_ACCESS: {
    message: "You don't have permission to access this resource",
    status: 403,
  },
  INVALIDE_ROLE: {
    message: 'Invalid role, must be either user or admin',
    status: 400,
  },
  
};

export default errorsVal;