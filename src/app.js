const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('@/config/config');
const morgan = require('@/config/morgan');
const routes = require('@/api/routes/v1');
const { errorConverter, errorHandler } = require('@/middlewares/error.middleware');
const ApiError = require('@/utils/ApiError');
const passport = require('passport');
const { jwtStrategy } = require('@/config/passport');

const app = express();

// jwt strategy
passport.use(jwtStrategy);

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// limit repeated failed requests
const limiter = require('./api/middlewares/rateLimiter.middleware');
app.use('/v1', limiter);

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
