const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const postController = require('../controllers/post.controller');
const postValidation = require('../validations/post.validation');
const { auth, author } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');

const postRoute = express.Router();

postRoute
  .route('/')
  .post(auth, upload.single('image'), validate(postValidation.createPost), postController.createPost)
  .get(auth, author(['admin']), validate(postValidation.getPosts), postController.getPosts);

postRoute
  .route('/:postId')
  .get(auth, validate(postValidation.getPostById), postController.getPostById)
  .put(auth, upload.single('image'), validate(postValidation.updatePostById), postController.updatePostById)
  .delete(auth, validate(postValidation.deletePostById), postController.deletePostById)

postRoute.route('/user/:userId').get(auth, validate(postValidation.getPostsByUserId), postController.getPostsByUserId);

module.exports = postRoute;
