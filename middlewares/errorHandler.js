module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
  };
  if (err.errors) response.errors = err.errors;
  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }
  res.status(status).json(response);
};


