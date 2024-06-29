const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true },
);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
