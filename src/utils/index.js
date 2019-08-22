const errorResponse = (error, res, statusCode) => res.status(statusCode).json({
  status: statusCode,
  error: error.message,
});

export default errorResponse;
