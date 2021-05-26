var mongoose = require('mongoose')
var Schema = mongoose.Schema

var schema = new Schema({
    genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
    subgenre: { type: Schema.Types.ObjectId, ref: 'Subgenre' },
    lecturer: { type: Schema.Types.ObjectId, ref: 'User' },
    lectures: [{ type: Schema.Types.ObjectId, ref: 'Lecture' }],
    name: String,
    description: { type: String, default: '' },
    level: { type: Number, default: 0 },
    needtoknow: [{ type: String }],
    targetstudent: [{ type: String }],
    willableto: [{ type: String }],
    coverphoto: { type: String, default: '/images/course-image.png' },
    previewvideo: String,
    cost: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    numberofstudent: { type: Number, default: 0 },
    star: Number,
    numberofreviews: { type: Number, default: 0 },
    review: { type: Boolean, default: false },
    public: { type: Boolean, default: false }
}, {
        timestamps: true
    })
//statics
schema.statics.findWithName = function (name, cb) {
    return this.findOne({ name: name }).exec(cb);
}
schema.statics.findById = function (id, cb) {
    return this.findOne({ _id: id }).exec(cb);
}
schema.statics.getTopViewGenres = function (idgenre, number, page, cb) {
    return this.find({ genre: idgenre }).sort({ numberofview: 1 })
        .skip((page - 1) * number).limit(number).exec(cb);
}
schema.statics.getTopViewSubgenres = function (idsubgenre, number, page, cb) {
    return this.find({ subgenre: idsubgenre }).sort({ numberofview: 1 })
        .skip((page - 1) * number).limit(number).exec(cb);
}
schema.statics.getTopStarGenres = function (idgenre, number, page, cb) {
    return this.find({ genre: idgenre }).sort({ star: 1 })
        .skip((page - 1) * number).limit(number).exec(cb);
}
schema.statics.getTopStarSubgenres = function (idsubgenre, number, page, cb) {
    return this.find({ subgenre: idsubgenre }).sort({ star: 1 })
        .skip((page - 1) * number).limit(number).exec(cb);
}




var model = mongoose.model('Course', schema);
module.exports = model;