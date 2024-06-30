const express = require('express');
const validate = require('../middlewares/validatre.middleware');
const userController = require('../controllers/user.controller');
const userValidation = require('../validations/user.validation');
const {auth, author} = require('../middlewares/auth.middleware');

const userRoute = express.Router();

userRoute.use(auth, author(['admin']));

userRoute.route('/').post(validate(userValidation.createUser), userController.createUser)   


module.exports = userRoute;
