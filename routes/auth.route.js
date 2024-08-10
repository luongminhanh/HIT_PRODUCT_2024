const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');
const { auth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');

const authRoute = express.Router();

authRoute.post('/register', validate(authValidation.register), authController.register);
authRoute.post('/login', validate(authValidation.login), authController.login);
authRoute.post('/refresh-token', validate(authValidation.refreshToken), authController.refreshToken);
authRoute.post('/change-password', auth, validate(authValidation.changePassword), authController.changePassword);
authRoute.put('/change-profile', auth, upload.single('avatar'), validate(authValidation.changeUserProfile), authController.changeUserProfile)
authRoute.post('/forgot-password', validate(authValidation.sendOtp), authController.sendOtp);
authRoute.post('/verify-otp', validate(authValidation.verifyOtp), authController.verifyOtp);
authRoute.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = authRoute;
