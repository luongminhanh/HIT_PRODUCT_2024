const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    numberOfCredit: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: 'https://th.bing.com/th/id/OIP.z3fa8PjEnvzg4bhW61tEOwAAAA?rs=1&pid=ImgDetMain',
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
  },
  { timestamps: true },
);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
