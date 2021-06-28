import ErrorResponse from '../utils/errorResponse.js';

const errorHandler = async (err, req, res, next) => {
  //loggo console for dev
  // console.log(err.stack.red); // => stack dell'errore e messaggio
  console.log(err);

  let error = { ...err };
  error.message = err.message;
  //mongoose bad object id
  if (err.name === 'CastError') {
    const message = `resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate keys => mi posta una field unique
  if (err.code === 11000) {
    const message = `Duplicate field value entered: ${
      Object.keys(err.keyValue)[0]
    }: ${Object.values(err.keyValue)[0]}`;
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error => bad request => errori nello schema
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
    console.log(error);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'internal server error',
  });
};

export default errorHandler;
