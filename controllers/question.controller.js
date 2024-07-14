const httpStatus = require('http-status');
const xlsx = require('xlsx');

const ApiError = require('../utils/ApiError');
const Question = require('../models/question.model');
const catchAsync = require('../utils/catchAsync');
const Subject = require('../models/subject.model');
const Test = require('../models/test.model');

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
    },
    meta: {
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    }
  });
});

const getQuestionsBySubjectId = catchAsync(async (req, res, next) => {
  const {subjectId} = req.params;

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found!');
  }

  const { limit = 10, page = 1, sortBy = 'name : asc' } = req.body;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = { subject: subjectId };

  const questions = await Question.find(query)
    .limit(limit)
    .skip(skip)
    .sort(sort)
    .select('-subject -createdAt -updatedAt');

  const totalResults = await Question.countDocuments(query);

  res.json({
    message: 'Get questions of the subject successfully',
    code: httpStatus.OK,
    data: {
      questions,
      subject
    },
    meta: {
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    }
  });
});

const getQuestionsByTestId = catchAsync(async (req, res, next) => {
  const {testId} = req.params;

  const test = await Test.findById(testId);

  console.log({test});

  if (!test) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found!');
  }

  const { limit = 10, page = 1, sortBy = 'name : asc' } = req.body;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = { test: testId };

  const questions = await Question.find(query)
    .limit(limit)
    .skip(skip)
    .sort(sort);

  const totalResults = await Question.countDocuments(query);

  res.json({
    message: 'Get questions of the test successfully',
    code: httpStatus.OK,
    data: {
      questions,
      test
    },
    meta: {
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    }
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

const importFile = async (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
  
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
  
    const questionsToInsert = jsonData.map(row => {
      const questionData = {
        content: row.question, 
        answers: [row.a, row.b, row.c, row.d], 
      };
      switch (row.answer) {
        case 'a':
          questionData.correctAnswer = row.a;
          break;
        case 'b':
          questionData.correctAnswer = row.b;
          break;
        case 'c':
          questionData.correctAnswer = row.c;
          break;
        case 'd':
          questionData.correctAnswer = row.d;
          break;
        default:
          questionData.correctAnswer = row.a; 
          break;
      }
  
      questionData.subject = "6692a20f7c1c06c4a3e41f05";
  
      return questionData;
    });
    await Question.insertMany(questionsToInsert);
    console.log('Questions imported successfully.');
  } catch (error) {
    console.error(error);
    throw new Error('Error importing file.'); 
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  getQuestionsBySubjectId,
  getQuestionsByTestId,
  importFile
};
