var express = require("express");
var router = express.Router();
var User = require("../models/user");

var _ = require("lodash");

/* GET home page. */
// router.get("/", function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.redirect("/courses");
//   } else {
//     next();
//   }
// });
// router.get("/user/*", function (req, res, next) {
//   if (!req.isAuthenticated()) {
//     res.redirect("/");
//   } else {
//     next();
//   }
// });
// router.get("/instructor*", function (req, res, next) {
//   if (!req.isAuthenticated()) {
//     res.redirect("/");
//   } else {
//     next();
//   }
// });
// router.get("/managecourse*", function (req, res, next) {
//   if (!req.isAuthenticated()) {
//     res.redirect("/");
//   } else {
//     next();
//   }
// });
// router.get("/managecourse/:courseid", function (req, res, next) {
//   return res.redirect("/managecourse/" + req.params.courseid + "/goals");
// });
// router.get("/managecourse/:courseid/*", function (req, res, next) {
//   User.count({
//     _id: req.user._id,
//     mycourses: {
//       $elemMatch: {
//         $eq: req.params.courseid,
//       },
//     },
//   }).exec((err, data) => {
//     if (err || data == 0) {
//       return res.redirect("/courses");
//     }
//     next();
//   });
// });
// router.get("/course/:courseid/learning", (req, res, next) => {
//   if (!req.isAuthenticated()) return res.redirect("/");
//   if (
//     !_.includes(JSON.stringify(req.user.mylearningcourses), req.params.courseid)
//   ) {
//     return res.redirect("/courses");
//   }
//   next();
// });
// router.get("/admin*", (req, res, next) => {
//   if (!req.isAuthenticated() || req.user.role == 0) {
//     return res.redirect("/courses");
//   }
//   next();
// });

router.get("/*", (req, res, next) => {
  res.render("index");
});
module.exports = router;
