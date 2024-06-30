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
    page: joi.number().integer()
  })
}

const getUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId)
  })
}

const updateUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId)
  }),
  body: joi.object().keys({
    fullname: joi.string().min(2).max(45).required().messages({
      'any.required': 'Vui lòng điền họ tên người dùng',
    }),
    gender: joi.string().required(  ).valid('Nam', 'Nữ'),
    dateOfBirth: joi.date().max('now').iso().messages({
      'date.base': 'Ngày sinh phải là một ngày hợp lệ',
      'date.format': 'Ngày sinh phải có định dạng hợp lệ (YYYY-MM-DD)',
      'date.max': 'Ngày sinh không được lớn hơn thời gian hiện tại',
    }),
  })
}

const deleteUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId)
  })
}

const lockUserById = {
  params: joi.object({
    userId: joi.string().required().custom(objectId)
  })
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  lockUserById
};
