var express = require("express");
var router = express.Router();

var Genre = require("../../models/genre");
var Subgenre = require("../../models/subgenre");
var User = require("../../models/user");
var Course = require("../../models/course");
var Lecture = require("../../models/lecture");

router.get("/get-courses-homepage", (req, res, next) => {
  Genre.find({})
    .select({ _id: 1, name: 1 })
    .exec((err, data) => {
      if (err) return res.send({ code: 404, message: "error" });
      let getCoursesPromises = [];
      for (let i = 0; i < data.length; i++) {
        let genre = data[i];
        getCoursesPromises[i] = new Promise((resolve, reject) => {
          Course.find({ genre: genre._id, public: true })
            .populate({ path: "lecturer", select: "-_id username photo" })
            .select({
              _id: 1,
              name: 1,
              coverphoto: 1,
              cost: 1,
              numberofstudent: 1,
              numberofreviews: 1,
              star: 1,
              lecturer: 1,
              description: 1,
            })
            .limit(8)
            .sort({ numberofstudent: -1 })
            .exec((err, data) => {
              if (err) return reject(err);
              console.log(data);
              return resolve({
                _id: genre._id,
                name: genre.name,
                courses: data,
              });
            });
        });
      }
      Promise.all(getCoursesPromises).then(
        (result) => {
          res.send({ code: 200, listCourses: result });
        },
        (err) => {
          res.send({ code: 404, message: "error" });
        }
      );
    });
});
router.get("/get-courses-genre/:genreid", (req, res, next) => {
  Genre.findOne({ _id: req.params.genreid })
    .populate({ path: "subgenres", select: "name" })
    .select({ name: 1, subgenres: 1 })
    .exec((err, genre) => {
      if (err) return res.send({ code: 404, message: "error" });
      let getCoursesPromises = [];
      for (let i = 0; i < genre.subgenres.length; i++) {
        let subgenre = genre.subgenres[i];
        getCoursesPromises[i] = new Promise((resolve, reject) => {
          Course.find({ subgenre: subgenre._id, public: true })
            .populate({ path: "lecturer", select: "-_id username photo" })
            .select({
              _id: 1,
              name: 1,
              coverphoto: 1,
              cost: 1,
              numberofstudent: 1,
              numberofreviews: 1,
              star: 1,
              lecturer: 1,
              description: 1,
            })
            .limit(8)
            .sort({ numberofstudent: -1 })
            .exec((err, data) => {
              if (err) return reject(err);
              return resolve({
                _id: subgenre._id,
                genre: subgenre.genre,
                name: subgenre.name,
                courses: data,
              });
            });
        });
      }
      Promise.all(getCoursesPromises).then(
        (result) => {
          res.send({
            code: 200,
            genre: { _id: genre._id, name: genre.name },
            listCourses: result,
          });
        },
        (err) => {
          res.send({ code: 404, message: "error" });
        }
      );
    });
});
router.post("/get-courses-subgenre/:subgenreid", (req, res, next) => {
  let condition = { subgenre: req.params.subgenreid, public: true };
  if (req.body.level) condition.level = req.body.level;
  if (req.body.free) condition.cost = req.body.free == "true" ? 0 : { $gt: 0 };

  let sort;
  if (!req.body.sort) sort = { numberofstudent: -1 };
  else {
    switch (parseInt(req.body.sort)) {
      case 1:
        sort = { numberofstudent: -1 };
        break;
      case 2:
        sort = { star: -1 };
        break;
      case 3:
        sort = { createdAt: -1 };
        break;
      case 4:
        sort = { cost: 1 };
        break;
      case 5:
        sort = { cost: -1 };
        break;
    }
  }
  Subgenre.findOne({ _id: req.params.subgenreid })
    .populate({ path: "genre", select: "name" })
    .select({ name: 1, genre: 1 })
    .exec((err, subgenre) => {
      if (err) return res.send({ code: 404, message: "error" });
      Course.find(condition)
        .populate({ path: "lecturer", select: "-_id username photo" })
        .select({
          _id: 1,
          name: 1,
          coverphoto: 1,
          cost: 1,
          numberofstudent: 1,
          numberofreviews: 1,
          star: 1,
          lecturer: 1,
          description: 1,
        })
        .skip((req.body.page || 1) * 8 - 8)
        .limit(8)
        .sort(sort)
        .exec((err, data) => {
          if (err) return res.send({ code: 404, message: "error" });
          return res.send({
            code: 200,
            genre: subgenre.genre,
            subgenre: {
              _id: subgenre._id,
              name: subgenre.name,
            },
            courses: data,
          });
        });
    });
});
router.post("/search", (req, res, next) => {
  let condition = { public: true };
  if (req.body.level) condition.level = req.body.level;
  if (req.body.free) condition.cost = req.body.free == "true" ? 0 : { $gt: 0 };
  if (req.body.name)
    condition.name = { $regex: ".*" + req.body.name + ".*", $options: "i" };

  let sort;
  if (!req.body.sort) sort = { numberofstudent: -1 };
  else {
    switch (parseInt(req.body.sort)) {
      case 1:
        sort = { numberofstudent: -1 };
        break;
      case 2:
        sort = { star: -1 };
        break;
      case 3:
        sort = { createdAt: -1 };
        break;
      case 4:
        sort = { cost: 1 };
        break;
      case 5:
        sort = { cost: -1 };
        break;
    }
  }
  Course.find(condition)
    .populate({ path: "lecturer", select: "-_id username photo" })
    .select({
      _id: 1,
      name: 1,
      coverphoto: 1,
      cost: 1,
      numberofstudent: 1,
      numberofreviews: 1,
      star: 1,
      lecturer: 1,
      description: 1,
    })
    .skip((req.body.page || 1) * 8 - 8)
    .limit(8)
    .sort(sort)
    .exec((err, data) => {
      if (err) return res.send({ code: 404, message: "error" });
      return res.send({
        code: 200,
        courses: data,
      });
    });
});
router.post("/get-courses-relate-lecturer", (req, res, next) => {
  Course.find({
    lecturer: req.body.lecturerid,
    _id: { $ne: req.body.courseid },
    public: true,
  })
    .populate({ path: "lecturer", select: { _id: 1, username: 1, photo: 1 } })
    .select({
      _id: 1,
      name: 1,
      coverphoto: 1,
      cost: 1,
      numberofstudent: 1,
      numberofreviews: 1,
      star: 1,
      lecturer: 1,
      description: 1,
    })
    .limit(4)
    .sort({ numberofstudent: -1 })
    .exec((err, data) => {
      if (err) return res.send({ code: 404, message: "error" });
      return res.send({ code: 200, courses: data });
    });
});

module.exports = router;
