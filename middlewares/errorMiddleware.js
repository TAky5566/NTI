// Dynamic Global Error Handler
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500; // default to 500
  const message = err.message || "Something went wrong";

  console.error("Error:", message);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  });
// nfdjn
}
export default errorHandler;
