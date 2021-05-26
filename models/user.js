var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var schema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    verified: { type: Boolean, default: false },
    verifytoken: { type: String, unique: true },
    biography: String,
    facebookid: String,
    googleid: String,
    website: String,
    twitter: String,
    youtube: String,
    linkedin: String,
    creditbalance: { type: Number, default: 0 },
    photo: { type: String, default: "/images/anonymous.png" },
    mycourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    mylearningcourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    mywishlist: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    role: { type: Number, default: 0 },
    paypalid: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);
//statics
schema.statics.findWithEmail = function (email, cb) {
  return this.findOne({ email: email })
    .select({ __v: 0, updatedAt: 0, createdAt: 0 })
    .exec(cb);
};
schema.statics.findById = function (id, cb) {
  return this.findOne({ _id: id })
    .select({ __v: 0, updatedAt: 0, createdAt: 0 })
    .exec(cb);
};
schema.statics.findByFbid = function (id, cb) {
  return this.findOne({ facebookid: id })
    .select({ __v: 0, updatedAt: 0, createdAt: 0 })
    .exec(cb);
};
schema.statics.findByGgid = function (id, cb) {
  return this.findOne({ googleid: id })
    .select({ __v: 0, updatedAt: 0, createdAt: 0 })
    .exec(cb);
};

var model = mongoose.model("User", schema);
module.exports = model;
