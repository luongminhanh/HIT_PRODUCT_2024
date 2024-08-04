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

module.exports = authRoute;
