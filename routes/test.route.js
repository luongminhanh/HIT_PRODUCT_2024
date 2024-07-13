const express = require('express');

const upload = require('../middlewares/multer.middleware');

const testController = require('../controllers/test.controller')
const userTestController = require('../controllers/user-test.controller')

const testRoute = express.Router();

testRoute.route('/').post(testController.createTest)
.get(testController.getAllTests);

testRoute
  .route('/:testId')
  .get(testController.getTestByTestId)
  .delete(testController.deleteTestById);
  
testRoute
  .route('/subject/:subjectId')
  .get(testController.getListTestOfASubject)

testRoute.route('/:testId/user/:userId')
.post(userTestController.createUserTest)

module.exports = testRoute;
