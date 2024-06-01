const responseMiddleware = (req, res, next) => {
  res.success = ({
    data,
    message = "Request was successful",
    status = 200,
  }) => {
    res.status(status).json({
      status: status,
      message: message,
      data: data,
    });
  };

  res.error = ({ error, message, status = 400 }) => {
    if (error?.name === "ValidationError") {
      const errors = Object.values(error.errors).map((error) => error.message);
      res.status(400).json({
        status: 400,
        errors: errors,
        data: null,
      });
    } else {
      res.status(status).json({
        status: status,
        message: message || "Internal server error. Try again later.",
        data: null,
      });
    }
  };

  next();
};

export default responseMiddleware;
