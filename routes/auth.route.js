const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const authValidate = require('../validations/auth.validation');
const authController = require('../controllers/auth.controller');

const authRoute = express.Router();

authRoute.post('/register', validate(authValidate.register), authController.register);

module.exports = authRoute;
