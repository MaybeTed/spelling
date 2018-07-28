const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WordsSchema = new Schema({
  word: { type: String, required: true, unique: true, validate: usernameValidator },
  correct: { type: Number },
  incorrect: { type: Number },
});

WordsSchema.pre('save', function(next) {
  var word = this;
  word.correct = 0;
  word.incorrect = 0;
  next();
});

module.exports = mongoose.model('Words', WordsSchema);