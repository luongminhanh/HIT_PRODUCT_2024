const { required } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userTestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    test: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
    },
    score: {
      type: Number,
      default: 0,
    },
    timeStart: {
      type: Date,
      required: true,
    },
    timeEnd: {
      type: Date,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: true,
    },
    exam: [
      {
        questionId: {
          type: Schema.Types.ObjectId,
          ref: 'Question',
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

const UserTest = mongoose.model('UserTest', userTestSchema);
module.exports = UserTest;
