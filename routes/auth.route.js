const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');

const authRoute = express.Router();

authRoute.post('/register', validate(authValidation.register), authController.register);
authRoute.post('/login', validate(authValidation.login), authController.login);
authRoute.post('/change-password', auth, validate(authValidation.changePassword), authController.changePassword);
authRoute.post('/change-profile', auth, validate(authValidation.changeUserProfile), upload.single('avatar'), authController.changeUserProfile)

module.exports = authRoute;
