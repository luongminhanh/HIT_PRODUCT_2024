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

questionRoute
  .route('/subject/:subjectId')
  .get(questionController.getQuestionsBySubjectId);

questionRoute
  .route('/test/:testId')
  .get(questionController.getQuestionsByTestId);

  questionRoute.post('/uploadExcelFile', 
    async (req, res) => {
      console.log(req)
      try {
        const filePath = './public' + '/excelUploads/Test.xlsx';

        await questionController.importFile(filePath); 
        res.json({ message: 'File imported successfully.' }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error importing file.' }); 
      }
    }
  );

module.exports = questionRoute;
