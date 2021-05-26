var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    star: { type: Number, default: 5.0 },
    content: { type: String, default: '' }
}, { timestamps: true })



var model = mongoose.model('Review', schema)
module.exports = model