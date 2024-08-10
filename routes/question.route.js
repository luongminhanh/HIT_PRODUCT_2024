const express = require('express');
const multer = require('multer');

const questionController = require('../controllers/question.controller');

const questionRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/excelUploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

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

  questionRoute.post('/uploadExcelFile/:subjectId', 
    upload.single('uploadfile'),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded.' });
        }
        const filePath = req.file.path;
        const subjectId = req.params.subjectId;
        await questionController.importFile(filePath,subjectId); 
        res.json({ message: 'File imported successfully.' }); 
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error importing file.' }); 
      }
    }
  );

module.exports = questionRoute;
