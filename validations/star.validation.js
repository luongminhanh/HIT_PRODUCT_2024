const joi = require('joi');
const { objectId } = require('./custorm.validation'); 

const toggleStarComment = {
  params: joi.object({
    commentId: joi.string().required().custom(objectId),
  }),
};

const checkUserStar = {
  params: joi.object({
    commentId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  toggleStarComment,
  checkUserStar,
};
