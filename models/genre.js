var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    subgenres: [{ type: Schema.Types.ObjectId, ref: 'Subgenre' }]
});
//statics

var model = mongoose.model('Genre', schema);
module.exports = model;