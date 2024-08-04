const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const likeController = require('../controllers/like.controller');
const likeValidation = require('../validations/like.validation');
const { auth } = require('../middlewares/auth.middleware');

const likeRoute = express.Router();

likeRoute
  .route('/:postId/toggle-like')
  .post(auth, validate(likeValidation.toggleLikePost), likeController.toggleLikePost);

likeRoute.route('/:postId/check-like').get(auth, validate(likeValidation.checkUserLike), likeController.checkUserLike);

module.exports = likeRoute;
