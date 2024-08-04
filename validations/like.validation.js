const joi = require('joi');
const { objectId } = require('./custorm.validation');

const toggleLikePost = {
  params: joi.object({
    postId: joi.string().required().custom(objectId),
  }),
};

const checkUserLike = {
  params: joi.object({
    postId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  toggleLikePost,
  checkUserLike,
};
