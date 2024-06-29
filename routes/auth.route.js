const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const authValidation = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

const authRoute = express.Router();

authRoute.post('/register', validate(authValidation.register), authController.register);
authRoute.post('/login', validate(authValidation.login), authController.login);

module.exports = authRoute;
