const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WordsSchema = new Schema({
  word: { type: String, required: true, unique: true },
  correct: { type: Number },
  incorrect: { type: Number },
});

module.exports = mongoose.model('Words', WordsSchema);