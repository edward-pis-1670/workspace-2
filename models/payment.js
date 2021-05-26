var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    information: {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        course: { type: Schema.Types.ObjectId, ref: 'Course' },
        default: {}
    },
    money: { type: Number, default: 0 },
    type: { type: Number, default: 0 }
}, {
        timestamps: true
    })

var model = mongoose.model('Payment', schema)
module.exports = model