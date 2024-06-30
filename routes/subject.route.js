const express = require('express');

const subjectController = require('../controllers/subject.controller');

const subjectRoute = express.Router();

subjectRoute.route('/').post(subjectController.createSubject).get(subjectController.getAllSubjects);

subjectRoute
  .route('/:subjectId')
  .get(subjectController.getSubjectById)
  .put(subjectController.updateSubjectById)
  .delete(subjectController.deleteSubjectById);

module.exports = subjectRoute;
