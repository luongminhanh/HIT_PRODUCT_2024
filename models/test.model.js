const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const testSchema = new Schema(
  {
    name: {
      type: String,
      select: false,
      required: true,
    },
    duration: {
      type: number,
      required: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      }
    ],
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
    }
  },
  { timestamps: true },
);

const Test = mongoose.model('Test', testSchema);

module.exports = Test;
