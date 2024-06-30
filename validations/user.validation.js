const joi = require('joi');
const { password } = require('./custorm.validation');
const { query } = require('express');

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
    dateOfBirth: joi.date().max('now').messages({
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

module.exports = {
  createUser,
  getUsers
};
