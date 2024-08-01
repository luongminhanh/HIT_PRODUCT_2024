const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');
const { auth, author } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');

const userRoute = express.Router();

userRoute
  .route('/')
  .post(auth, author(['admin']), validate(userValidation.createUser), userController.createUser)
  .get(auth, author(['admin', 'member']), validate(userValidation.getUsers), userController.getUsers);
userRoute
  .route('/:userId')
  .get(auth, author(['admin', 'member']), validate(userValidation.getUserById), userController.getUserById)
  .put(auth, author(['admin']), validate(userValidation.updateUserById), upload.single('avatar'), userController.updateUserById)
  .delete(auth, author(['admin', 'member']), validate(userValidation.deleteUserById), userController.deleteUserById)
  .patch(auth, author(['admin']), validate(userValidation.lockUserById), userController.lockUserById);

module.exports = userRoute;
