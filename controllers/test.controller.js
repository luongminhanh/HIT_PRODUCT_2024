const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const Test = require('../models/test.model');
const catchAsync = require('../utils/catchAsync');

const createTest = catchAsync(async (req, res, next) => {
  const newTest = await Test.create(req.body);

  res.status(httpStatus.CREATED).json({
    message: 'Create new test successfully!',
    code: httpStatus.CREATED,
    data: {
      test: newTest,
    },
  });
});

const getTestByTestId = catchAsync(async (req, res, next) => {
  const { testId } = req.params;

  const test = await Test.findById(testId).populate([
    {
      path: 'questions',
      select: '-subject -createdAt -updatedAt',
    },
  ]);;

  if (!test) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found!');
  }

  res.status(httpStatus.OK).json({
    message: 'Get test successfully!',
    code: httpStatus.OK,
    data: {
      test: test,
    },
  });
});

const getListTestOfASubject = catchAsync(async (req, res, next) => {
  const { subjectId } = req.params;

  const query = { subject: subjectId };

  const test = await Test.find(query).select('-questions -subject');

  if (!test) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found!');
  }

  res.status(httpStatus.OK).json({
    message: 'Get list test of a subject successfully!',
    code: httpStatus.OK,
    data: {
      test: test,
    },
  });
});

const getAllTests = catchAsync(async (req, res, next) => {
  const { limit = 10, page = 1, sortBy = 'name : asc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const tests = await Test.find().limit(limit).skip(skip).sort(sort);

  const totalResults = await Test.countDocuments(query);

  res.json({
    message: 'Get tests successfully',
    code: httpStatus.OK,
    data: {
      tests,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const updateTestById = catchAsync(async (req, res, next) => {
  if (req.file) req.body['image'] = req.file.path;

  const { testId } = req.params;

  const updateBody = req.body;

  const test = await Test.findById(testId);

  if (!test) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found!');
  }

  Object.assign(test, updateBody);

  test.save();

  res.json({
    message: 'Update test successfully!',
    code: httpStatus.OK,
    data: {
      test: test,
    },
  });
});

const deleteTestById = catchAsync(async (req, res, next) => {
  const { testId } = req.params;

  const testDel = await Test.findByIdAndDelete(testId);

  if (!testDel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found');
  }

  res.status(httpStatus.OK).json({
    message: 'Delete test successfully!',
    code: httpStatus.OK,
    data: {
      test: testDel,
    },
  });
});

module.exports = {
  createTest,
  getAllTests,
  getTestByTestId,
  getListTestOfASubject,
  updateTestById,
  deleteTestById,
};
