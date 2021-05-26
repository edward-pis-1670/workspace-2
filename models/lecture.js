var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    video: String,
    preview: { type: Boolean, default: false }
}, {
        timestamps: true
    });
//statics

var model = mongoose.model('Lecture', schema);
module.exports = model;