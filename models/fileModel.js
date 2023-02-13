const mongoose = require('mongoose');
 
const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: true },
    
  });
 
 
module.exports = mongoose.model('File', fileSchema);