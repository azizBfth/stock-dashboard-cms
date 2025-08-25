const mongoose = require('mongoose');

const CremeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  enterDateTime: { type: Date, required: true },
  openDateTime: { type: Date, required: false },
  expirationDate: { type: Date, required: false },
  expirationDateAfterOpen: { type: Date, required: false,  }
}, { timestamps: true });

module.exports = mongoose.model('Creme', CremeSchema);