const joi = require('joi');
const { password, objectId } = require('./custorm.validation');

const createUser = {
  body: joi.object().keys({
    fullname: joi.string().min(2).max(45).required().messages({
      'any.required': 'Vui lòng điền họ tên người dùng',
    }),
    email: joi.string().email().required(),
    password: joi.string().required().custom(password),
    role: joi.string(),
    avatar: joi.string(),
    gender: joi.string().valid('Nam', 'Nữ'),
    dateOfBirth: joi.date().max('now').iso().messages({
      'date.base': 'Ngày sinh phải là một ngày hợp lệ',
      'date.format': 'Ngày sinh phải có định dạng hợp lệ (YYYY-MM-DD)',
      'date.max': 'Ngày sinh không được lớn hơn thời gian hiện tại',
    }),
  }),
};

const getUsers = {
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
};

const updateUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
  body: joi.object().keys({
    fullname: joi.string().min(2).max(45).optional().messages({
      'string.base': 'Họ tên phải là một chuỗi',
      'string.min': 'Họ tên phải có ít nhất 2 ký tự',
      'string.max': 'Họ tên không được vượt quá 45 ký tự',
      'any.required': 'Vui lòng điền họ tên người dùng',
    }),
    gender: joi.string().optional().valid('Nam', 'Nữ').messages({
      'any.only': 'Giới tính chỉ có thể là "Nam" hoặc "Nữ"',
    }),
    dateOfBirth: joi.date().max('now').iso().optional().messages({
      'date.base': 'Ngày sinh phải là một ngày hợp lệ',
      'date.format': 'Ngày sinh phải có định dạng hợp lệ (YYYY-MM-DD)',
      'date.max': 'Ngày sinh không được lớn hơn thời gian hiện tại',
    }),
    avatar: joi.string().optional(),
    isLocked: joi.boolean().optional(),
    role: joi.string().optional().valid('admin', 'member').messages({
      'any.only': 'Vai trò chỉ có thể là "admin" hoặc "member"',
    }),
  })
};


const deleteUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
};

const lockUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  lockUserById,
};
