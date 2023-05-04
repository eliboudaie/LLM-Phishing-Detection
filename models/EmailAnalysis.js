'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailAnalysisSchema = new Schema({
  emailBody: String,
  phishingAnalysisResult: String,
  userId: String
});

module.exports = mongoose.model('EmailAnalysis', emailAnalysisSchema);