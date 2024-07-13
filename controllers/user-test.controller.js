const httpStatus = require('http-status');
const UserTest = require('../models/user-test.model');
const Test = require('../models/test.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createUserTest = catchAsync(async (req, res) => {
  const userAnswer = req.body.exam;

  const {testId, questionId} = req.params;

  const answersTest = await Test.findById(testId).populate({
    path: 'questions',
    select: 'correctAnswer -_id'
  });

  console.log('ans', answersTest.questions);

  let numberOfCorrectAns = 0;
  const numberOfQuestion = answersTest.questions.length;

  for (let i = 0; i<numberOfQuestion; i++) {
    if (answersTest.questions[i].correctAnswer === userAnswer[i].answer) {
      numberOfCorrectAns++;
    }
  }

  const finalScore = numberOfCorrectAns/numberOfQuestion * 100;

  return res.status(httpStatus.CREATED).json({
    message: 'Send test successfully!',
    finalScore
  })
});

module.exports = {
    createUserTest
}