/**
 * Created by chamilp on 1/13/18.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fileSchema = new Schema({
  fileId: Number,
  fileName: {
    type : String,
    unique : true,
    required : true,
    dropDups: true
  },
  hashString: String,
  fileSize: Number,
  fileCompletion: Number,
  inProgress: Boolean,
  downloadLink: String
}, {_id:true});

module.exports = mongoose.model('File', fileSchema);
