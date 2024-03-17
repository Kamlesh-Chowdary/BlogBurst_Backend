const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";

      res.status(statusCode).json({
        success: false,
        message: message,
      });
    });
  };
};

export { asyncHandler };
