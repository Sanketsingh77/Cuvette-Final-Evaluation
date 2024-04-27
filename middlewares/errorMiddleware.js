export const errorHandler = (err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errMessage = err.message || "Something went wrong!";

  res.status(errorStatus).json({
    message: errMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
