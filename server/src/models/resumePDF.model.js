const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const fileSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

fileSchema.plugin(toJSON);
fileSchema.plugin(paginate);

const resumePDF = mongoose.model('resumePDF', fileSchema);

module.exports = resumePDF;
