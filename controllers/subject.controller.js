const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const Subject = require('../models/subject.model');
const catchAsync = require('../utils/catchAsync');
const Question = require('../models/question.model');

const createSubject = catchAsync(async (req, res, next) => {
  if (req.file) req.body['image'] = req.file.path;
  const newSubject = await Subject.create(req.body);

  res.status(httpStatus.CREATED).json({
    message: 'Create subject successfully!',
    code: httpStatus.CREATED,
    data: {
      subject: newSubject,
    },
  });
});

const getSubjectById = catchAsync(async (req, res, next) => {
  const { subjectId } = req.params;

  const query = {
    status: true
  }

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found!');
  }

  res.status(httpStatus.OK).json({
    message: 'Get subject successfully!',
    code: httpStatus.OK,
    data: {
      subject: subject,
    },
  });
});

const getAllSubjects = catchAsync(async (req, res, next) => {
  const { limit = 10, page = 1, sortBy = 'name : asc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {
    status: true
  };

  const subjects = await Subject.find(query).limit(limit).skip(skip).sort(sort).select('-questions');

  const totalResults = await Subject.countDocuments(query);

  res.json({
    message: 'Get subjects successfully',
    code: httpStatus.OK,
    data: {
      subjects,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const updateSubjectById = catchAsync(async (req, res, next) => {
  if (req.file) req.body['image'] = req.file.path;

  const { subjectId } = req.params;

  const updateBody = req.body;

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found!');
  }

  Object.assign(subject, updateBody);

  subject.save();

  res.json({
    message: 'Update subject successfully!',
    code: httpStatus.OK,
    data: {
      subject: subject,
    },
  });
});

const deleteSubjectById = catchAsync(async (req, res, next) => {
  const { subjectId } = req.params;

  const updateBody = {...req.body, status: false};

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }

  Object.assign(subject, updateBody);

  subject.save();

  res.status(httpStatus.OK).json({
    message: 'Delete subject successfully!',
    code: httpStatus.OK,
    data: {
      subject: subject,
    },
  });
});

//user practice by doing questions of a subject and send result, BE send result
const sendAnswersOfPracticeBySubjectAndGetResult = catchAsync(async (req, res) => {
  const userAnswer = req.body.practice;
  console.log(userAnswer);

  const {subjectId, questionId} = req.params;

  const correctAnswersSubject = await Question.find({subject: subjectId}).select('correctAnswer -_id');
  const ans = correctAnswersSubject.map(item => item.correctAnswer)

  let numberOfCorrectAns = 0;
  const numberOfQuestion = ans.length;

  for (let i = 0; i<numberOfQuestion; i++) {
    if (ans[i] === userAnswer[i]?.answer) {
      numberOfCorrectAns++;
    }
  }

  const finalScore = numberOfCorrectAns/numberOfQuestion * 100;

  return res.status(httpStatus.CREATED).json({
    message: 'Send result  successfully!',
    finalScore
  })
});

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubjectById,
  deleteSubjectById,
  sendAnswersOfPracticeBySubjectAndGetResult
};
