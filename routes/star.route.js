const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const starController = require('../controllers/star.controller');
const starValidation = require('../validations/star.validation');
const { auth } = require('../middlewares/auth.middleware');

const starRoute = express.Router();

starRoute
  .route('/:commentId/toggle-star')
  .post(auth, validate(starValidation.toggleStarComment), starController.toggleStarComment);

starRoute
  .route('/:commentId/check-star')
  .get(auth, validate(starValidation.checkUserStar), starController.checkUserStar);

module.exports = starRoute;
