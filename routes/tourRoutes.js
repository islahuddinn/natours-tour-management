const express = require('express');
const authControler = require('../dev-data/controllers/authController');
const tourController = require('./../dev-data/controllers/tourController');
const reviewRouter = require('./../routes/reviewRouts');
// const Review = require('../models/reviewModel');

const router = express.Router();

// POST/tour/231adw/reviews
// GET/tour/231adw/reviews
// GET/tour/231adw/reviews/O3RJHFDU89

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithIn);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    tourController.updateTour
  )
  .delete(
    authControler.protect,
    authControler.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
