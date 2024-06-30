const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const Question = require('../models/question.model');
const catchAsync = require('../utils/catchAsync');

const createQuestion = catchAsync(async (req, res, next) => {

  const newQuestion = await Question.create(req.body);

  res.status(httpStatus.CREATED).json({
    mesage: 'Create question successfully',
    code: httpStatus.CREATED,
    data: {
      question: newQuestion,
    },
  });
});

const getQuestionById = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;

  const question = await Question.findById(questionId)

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found!');
  }

  res.status(httpStatus.OK).json({
    message: 'Get question successfully!',
    code: httpStatus.OK,
    data: {
      question: question,
    },
  });
});

const getAllQuestions = catchAsync(async (req, res, next) => {
  const { limit = 10, page = 1, sortBy = 'name : asc' } = req.body;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const questions = await Question.find()
    .limit(limit)
    .skip(skip)
    .sort(sort);

  const totalResults = await Question.countDocuments(query);

  res.json({
    message: 'Get questions successfully',
    code: httpStatus.OK,
    data: {
      questions,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const updateQuestionById = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;

  const updateBody = req.body;

  const question = await Question.findById(questionId);

  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found!');
  }

  Object.assign(question, updateBody);

  question.save();

  res.json({
    message: 'Update question successfully!',
    code: httpStatus.OK,
    data: {
      question: question,
    },
  });
});

const deleteQuestionById = catchAsync(async (req, res, next) => {
  const { questionId } = req.params;

  const questionDel = await Question.findByIdAndDelete(questionId);

  if (!questionDel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  res.status(httpStatus.OK).json({
    message: 'Delete question successfully!',
    code: httpStatus.OK,
    data: {
      question: questionDel,
    },
  });
});

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
