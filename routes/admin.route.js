const express = require('express');
const subjectController = require('../controllers/subject.controller');
const upload = require('../middlewares/multer.middleware');
const adminRoute = express.Router();

adminRoute.route('/subjects').post(upload.single('image'), subjectController.createSubject)
.get(subjectController.getAllSubjectsByAdmin)

adminRoute.route('/subjects/:subjectId').delete(subjectController.deleteSubjectById)

module.exports = adminRoute