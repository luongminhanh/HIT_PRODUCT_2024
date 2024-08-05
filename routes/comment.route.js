const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const commentController = require('../controllers/comment.controller');
const commentValidation = require('../validations/comment.validation');
const { auth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');

const commentRoute = express.Router();

commentRoute
  .route('/')
  .post(auth, upload.single('image'), validate(commentValidation.createComment), commentController.createComment);

commentRoute
  .route('/:postId')
  .get(validate(commentValidation.getCommentsByPost) , commentController.getCommentsByPost);

commentRoute
  .route('/:commentId')
  .put(auth, upload.single('image'), validate(commentValidation.updateComment), commentController.updateComment)
  .delete(auth, validate(commentValidation.deleteCommentsById), commentController.deleteComment);

module.exports = commentRoute;
