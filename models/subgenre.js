var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
    name: String
});
//statics

var model = mongoose.model('Subgenre', schema);
module.exports = model;