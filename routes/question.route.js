const express = require('express');

const questionController = require('../controllers/question.controller');

const questionRoute = express.Router();

questionRoute.route('/').post(questionController.createQuestion)
.get(questionController.getAllQuestions);

questionRoute
  .route('/:questionId')
  .get(questionController.getQuestionById)
  .put(questionController.updateQuestionById)
  .delete(questionController.deleteQuestionById);

module.exports = questionRoute;
