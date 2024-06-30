const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');
const Subject = require('../models/subject.model');
const catchAsync = require('../utils/catchAsync');

const createSubject = catchAsync(async (req, res, next) => {
  const newSubject = await Subject.create(req.body);

  res.status(httpStatus.CREATED).json({
    mesage: 'Tạo thành công lớp học',
    code: httpStatus.CREATED,
    data: {
      subject: newSubject,
    },
  });
});

const getSubjectById = catchAsync(async (req, res, next) => {
  const { subjectId } = req.params;

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
  const { limit = 10, page = 1, sortBy = 'name : asc' } = req.body;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const subjects = await Subject.find().limit(limit).skip(skip).sort(sort);

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

  const subjectDel = await Subject.findByIdAndDelete(subjectId);

  if (!subjectDel) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Subject not found');
  }

  res.status(httpStatus.OK).json({
    message: 'Delete subject successfully!',
    code: httpStatus.OK,
    data: {
      subject: subjectDel,
    },
  });
});

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubjectById,
  deleteSubjectById,
};
