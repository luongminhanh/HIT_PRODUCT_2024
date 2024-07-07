const express = require('express');

const upload = require('../middlewares/multer.middleware');

const testController = require('../controllers/test.controller')

const testRoute = express.Router();

testRoute.route('/').post(testController.createTest)
.get(testController.getAllTests);

testRoute
  .route('/:testId')
  .get(testController.getTestById)
  .delete(testController.deleteTestById);

module.exports = testRoute;
