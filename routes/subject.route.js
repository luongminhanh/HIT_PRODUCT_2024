const express = require('express');

const upload = require('../middlewares/multer.middleware');

const subjectController = require('../controllers/subject.controller');

const subjectRoute = express.Router();

subjectRoute.route('/').post(upload.single('image'), subjectController.createSubject)
.get(subjectController.getAllSubjects);

subjectRoute
  .route('/:subjectId')
  .get(subjectController.getSubjectById)
  .put(upload.single('image'), subjectController.updateSubjectById)
  .delete(subjectController.deleteSubjectById)

subjectRoute.route('/:subjectId/practice').post( subjectController.sendAnswersOfPracticeBySubjectAndGetResult)

module.exports = subjectRoute;
