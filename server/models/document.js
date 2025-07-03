const mongoose = require('mongoose');

const childSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String },
  description: { type: String }
});

const documentSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String },
  description: { type: String },
  children: [childSchema] // array of child documents
});

module.exports = mongoose.model('Document', documentSchema);
