var express = require("express");
var router = express.Router();

var User = require("../../models/user");
var Course = require("../../models/course");
var Lecture = require("../../models/lecture");

var send = require("send");
var _ = require("lodash");
const sharp = require("sharp");

router.get("/images", (req, res, next) => {
  res.redirect(req.query.src);
  // console.log(req.query.src)
  // sharp('public' + req.query.src).resize(parseInt(req.query.w), parseInt(req.query.h)).toBuffer((err, buffer, info) => {
  //     if (err) {
  //         console.log(err)
  //         res.end()
  //     }
  //     res.send(buffer)
  // })
});
router.get("/play-video-preview/:lectureid", (req, res, next) => {
  Lecture.findOne({ _id: req.params.lectureid, preview: true }).exec(
    (err, data) => {
      if (err || !data) return res.end();
      return send(req, data.video).pipe(res);
    }
  );
});

router.get("/*", (req, res, next) => {
  if (!req.isAuthenticated()) return res.end();
  next();
});
router.post("/*", (req, res, next) => {
  if (!req.isAuthenticated()) return res.end();
  next();
});

router.get("/play-video-lecturer/:lectureid", (req, res, next) => {
  User.findOne({ _id: req.user._id }).exec((err, data) => {
    if (err) return res.end();
    Course.findOne({
      _id: { $in: data.mycourses },
      lectures: {
        $elemMatch: {
          $eq: req.params.lectureid,
        },
      },
    }).exec((err, data) => {
      if (err || !data) return res.end();
      Lecture.findOne({ _id: req.params.lectureid }).exec((err, data) => {
        if (err) return res.end();
        return send(req, data.video).pipe(res);
      });
    });
  });
});
router.get("/play-video-learning/:courseid/:lectureid", (req, res, next) => {
  if (
    _.includes(JSON.stringify(req.user.mylearningcourses), req.params.courseid)
  ) {
    Course.findOne({
      _id: req.params.courseid,
      lectures: {
        $elemMatch: {
          $eq: req.params.lectureid,
        },
      },
    }).exec((err, data) => {
      if (err || !data) return res.end();
      Lecture.findOne({ _id: req.params.lectureid }).exec((err, data) => {
        if (err) return res.end();
        return send(req, data.video).pipe(res);
      });
    });
  } else {
    res.end();
  }
});
router.get("/play-video-admin/:lectureid", (req, res, next) => {
  if (req.user.role != 1) return res.end();
  Lecture.findOne({ _id: req.params.lectureid }).exec((err, data) => {
    if (err) return res.end();
    return send(req, data.video).pipe(res);
  });
});

module.exports = router;
