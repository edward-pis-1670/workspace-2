var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    to: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    url: { type: String, default: '' },
    seen: { type: Boolean, default: false }
}, {
        timestamps: true
    })

var model = mongoose.model('Notification', schema);
module.exports = model;