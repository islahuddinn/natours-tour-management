const express = require('express');
const reviewController = require('../dev-data/controllers/reviewController');
const authController = require('./../dev-data/controllers/authController');

const router = express.Router({ mergeParams: true });

// POST/tour/231adw/reviews
// GET/tour/231adw/reviews

router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
