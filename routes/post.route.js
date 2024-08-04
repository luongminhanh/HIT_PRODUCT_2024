const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const postController = require('../controllers/post.controller');
const postValidation = require('../validations/post.validation');
const { auth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');

const userRoute = express.Router();

userRoute
  .route('/')
  .post(auth,upload.single('image'), validate(postValidation.createPost), postController.createPost);
//   .get(auth, validate(userValidation.getUserById), userController.getUserById)
//   .put(auth, validate(userValidation.updateUserById), upload.single('avatar'), userController.updateUserById)
//   .delete(auth, validate(userValidation.deleteUserById), userController.deleteUserById)

module.exports = userRoute;
