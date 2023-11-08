const express = require('express');
const userControler = require('.././dev-data/controllers/userController');
const authController = require('../dev-data/controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// protecting all routes ussing protect midleware
router.use(authController.protect);

router.patch(
  '/updatePassword',
  authController.updatePassword
);
router.get(
  '/me',
  userControler.getMe,
  userControler.getUser
);
router.patch('/updateMe', userControler.updateMe);
router.delete('/deleteMe', userControler.deleteMe);


router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userControler.getAllUsers)
  .post(userControler.createUser);

router
  .route('/:id')
  .get(userControler.getUser)
  .patch(userControler.updateUser)
  .delete(userControler.deleteUser);

module.exports = router;
