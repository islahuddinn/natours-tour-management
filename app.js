const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./dev-data/controllers/errorController');
const tourRouter = require('./routes/tourRoutes');

const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRouts');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//1) GLOBAL MIDDLEWARES
// serving static files
app.use(express.static(path.join(__dirname, 'public')));

//set security http headers
app.use(helmet());
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit request from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api', limiter);

// Body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization againset no sql query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// prevent parameters duplication/parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
      'maxGroupSize',
      'difficulty'
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  console.log('Hey, from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  // console.log(req.headers);
  next();
});

// ROUTE HANDLERS

//ROUTES
app.get('/', (req, res) => {
  res.status(200).render('base');
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

//START SERVER
module.exports = app;
