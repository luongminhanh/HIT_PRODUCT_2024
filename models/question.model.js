const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    test: {
      type: Schema.Types.ObjectId,
      ref: 'Test'
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject' 
    },
    content: {
        type: String,
        required: true, 
    },
    answers: {
      type: [String]
    },
    correctAnswer: {
      type: String
    }
  },
  { timestamps: true },
);

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
