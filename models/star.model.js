const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const starSchema = new Schema({
  comment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

const Star = mongoose.model('Star', starSchema);

module.exports = Star;
