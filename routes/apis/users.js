var express = require('express')
var router = express.Router()
var User = require('../../models/user')
var Course = require('../../models/course')
var Lecture = require('../../models/lecture')
var Notification = require('../../models/notification')
var Payment = require('../../models/payment')
var multer = require('multer')
var uploadavatar = multer({ dest: 'public/uploads/avatars' })
var uploadcoursephoto = multer({ dest: 'public/uploads/courses-photo' })
var uploadcoursevideo = multer({ dest: 'uploads/courses-video' })
var uploadcoursepreviewvideo = multer({ dest: 'public/uploads/courses-video' })

var _ = require('lodash')
var fs = require('fs')
const bcrypt = require('bcryptjs');

router.post('/verify', (req, res, next) => {
    if (req.isAuthenticated())
        return res.send({ code: 404, message: 'error' })
    User.update({
        verifytoken: req.body.verifytoken,
        verified: false
    }, { verified: true }).exec((err, data) => {
        if (err || data.n == 0)
            return res.send({ code: 404, message: 'error' })
        return res.send({ code: 200, message: 'success' })
    })
})
router.post('/view-user', (req, res, next) => {
    User.findOne({ _id: req.body.id })
        .populate({ path: 'mycourses', populate: { path: 'lecturer', select: { username: 1, photo: 1 } }, select: { _id: 1, name: 1, coverphoto: 1, cost: 1, numberofstudent: 1, numberofreviews: 1, star: 1, lecturer: 1, description: 1 } })
        .select({ _id: 1, username: 1, email: 1, photo: 1, mycourses: 1, googleid: 1, linkedin: 1, twitter: 1, website: 1, youtube: 1, biography: 1 })
        .exec((err, user) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            return res.send({ code: 200, user: user })
        })
})

router.get('/*', (req, res, next) => {
    if (!req.isAuthenticated())
        return res.send({ code: 1001, message: 'Account is not logged in' });
    next()
})
router.post('/*', (req, res, next) => {
    if (!req.isAuthenticated())
        return res.send({ code: 1001, message: 'Account is not logged in' });
    next()
})

router.get('/getuserinfo', (req, res, next) => {
    let data = {
        code: 200,
        message: 'success',
    }
    Notification.find({ to: req.user._id })
        .populate({ path: 'from', select: { photo: 1 } })
        .select({ __v: 0, updatedAt: 0, to: 0 })
        .limit(4).sort({ createdAt: -1 }).exec((err, notis) => {
            if (err)
                res.send({ code: 404, message: 'error' })
            let user = Object.assign({}, req.user._doc)
            user.notis = notis
            data.user = user
            res.send(data)
        })
})
router.post('/edit-profile', (req, res, next) => {
    let user = req.user
    user.username = req.body.username
    user.biography = req.body.biography
    user.website = req.body.website
    user.twitter = req.body.twitter
    user.youtube = req.body.youtube
    user.linkedin = req.body.linkedin
    user.save(function(err) {
        if (err) {
            let data = {
                code: 404,
                message: 'error',
            }
            return res.send(data);
        }
        let data = {
            code: 200,
            message: 'success',
            profile: req.body
        }
        return res.send(data);
    })
})
router.post('/edit-photo', uploadavatar.single('avatar'), (req, res, next) => {
    let user = req.user
    let oldPhoto = req.user.photo
    user.photo = "/uploads/avatars/" + req.file.filename
    user.save(function(err) {
        if (err) {
            fs.unlink('public/uploads/avatars/' + req.file.filename, (err) => { })
            let data = {
                code: 404,
                message: 'error',
            }
            return res.send(data);
        }
        if (oldPhoto.substring(1, 8) == 'uploads') {
            fs.unlink('public' + oldPhoto, (err) => { })
        }
        let data = {
            code: 200,
            message: 'success',
            photo: req.user.photo
        }
        return res.send(data);
    })
})
router.post('/edit-account', (req, res, next) => {
    User.findOne({ _id: req.user._id }).exec((err, user) => {
        if (req.body.newPassword == '')
            return res.send({ code: 404, message: 'error' })
        if (!user.password || user.password == '') {
            bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                if (err)
                    return res.send({ code: 404, message: 'error' })
                user.password = hash;
                user.save((err) => {
                    if (err)
                        return res.send({ code: 404, message: 'error' })
                    return res.send({ code: 200, message: 'success', user: req.user })
                })
            })
            return
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
                return res.send({ code: 404, message: 'error' })
            }
            if (!result) {
                return res.send({ code: 404, message: 'invalid password' })
            }
            bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                if (err)
                    return res.send({ code: 404, message: 'error' })
                user.password = hash;
                user.save((err) => {
                    if (err)
                        return res.send({ code: 404, message: 'error' })
                    return res.send({ code: 200, message: 'success', user: req.user })
                })
            })
            return
        })
    })
})
router.post('/delete', (req, res, next) => {
    if (req.body.password) {
        let u = req.user
        User.findOne({ _id: u._id }).exec((err, user) => {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err)
                    return res.send({ code: 404, message: 'error' })
                if (!result)
                    return res.send({ code: 404, message: 'invalid password' })
                User.findByIdAndRemove(u._id, (err, user) => {
                    if (err) res.send({ code: 404, message: 'error' })
                    if (user.photo.substring(1, 8) == 'uploads')
                        fs.unlink('public' + user.photo, (err) => { })
                    fs.unlink('public' + user.photo, (err) => { })
                    res.send({ code: 200, message: "success" })
                })
            })
        })
        return
    }
    User.findOneAndRemove({ _id: req.user._id, facebookid: req.body.facebookid }, (err, user) => {
        if (err) res.send({ code: 404, message: 'error' })
        if (user.photo.substring(1, 8) == 'uploads')
            fs.unlink('public' + user.photo, (err) => { })
        fs.unlink('public' + user.photo, (err) => { })
        res.send({ code: 200, message: "success" })
    })
})
router.post('/createcourse', (req, res, next) => {
    let user = req.user
    let course = new Course({ name: req.body.coursename, lecturer: user._id })
    course.save((err) => {
        if (err)
            return res.send({ code: 404, message: 'error' })
        User.findByIdAndUpdate(
            user._id,
            { $push: { "mycourses": course._id } },
            (err, user) => {
                if (err)
                    return res.send({ code: 404, message: 'error' })
                return res.send({
                    code: 200,
                    message: 'success',
                    course: {
                        _id: course._id,
                        createdAt: course.createdAt,
                        name: course.name,
                        revenue: 0,
                        numberofreviews: 0,
                        numberofstudent: 0,
                        coverphoto: course.coverphoto,
                        public: false
                    }
                })
            }
        )
    })
})
router.get('/get-all-mycourses', (req, res, next) => {
    User.findOne({ _id: req.user._id }).populate({
        path: 'mycourses',
        select: '-__v -updatedAt -lecturer -willableto -needtoknow -targetstudent -lectures'
    }).exec(function(err, user) {
        if (err) return handleError(err);
        res.end(JSON.stringify(user.mycourses));
    });
    return
})
router.post('/set-course-goals', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        Course.update({ _id: req.body.courseid }, {
            needtoknow: req.body.needtoknow,
            targetstudent: req.body.targetstudent,
            willableto: req.body.willableto
        }, { multi: false }, (err, course) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            return res.send({
                code: 200,
                message: 'success',
                course: {
                    _id: req.body.courseid,
                    needtoknow: req.body.needtoknow,
                    targetstudent: req.body.targetstudent,
                    willableto: req.body.willableto
                }
            })
        })
    })
})
router.post('/get-course-goals', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        Course.findOne({ _id: req.body.courseid }, (err, course) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            return res.send({
                code: 200,
                message: 'success',
                course: {
                    _id: req.body.courseid,
                    needtoknow: course.needtoknow,
                    targetstudent: course.targetstudent,
                    willableto: course.willableto
                }
            })
        })
    })
})
router.post('/get-course', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        Course.findOne({ _id: req.body.courseid }, (err, course) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            return res.send({
                code: 200,
                message: 'success',
                course: {
                    _id: req.body.courseid,
                    name: course.name,
                    public: course.public,
                    review: course.review,
                    coverphoto: course.coverphoto,
                    cost: course.cost
                }
            })
        })
    })
})
router.post('/get-course-description', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        Course.findOne({ _id: req.body.courseid }, (err, course) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            return res.send({
                code: 200,
                message: 'success',
                course: {
                    _id: req.body.courseid,
                    name: course.name,
                    previewvideo: course.previewvideo,
                    description: course.description,
                    coverphoto: course.coverphoto,
                    genre: course.genre,
                    subgenre: course.subgenre,
                    level: course.level
                }
            })
        })
    })
})
router.post('/set-course-description', uploadcoursephoto.single('coverphoto'), (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        let obj = { name: req.body.name, level: req.body.level }
        if (req.file) obj.coverphoto = '/uploads/courses-photo/' + req.file.filename
        if (req.body.description && req.body.description != 'undefined')
            obj.description = req.body.description
        if (req.body.genre && req.body.genre != 'undefined') obj.genre = req.body.genre
        if (req.body.subgenre && req.body.subgenre != 'undefined') obj.subgenre = req.body.subgenre
        Course.findByIdAndUpdate(req.body.courseid, obj, (err, course) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            if (req.file) {
                let oldPhoto = course.coverphoto
                if (oldPhoto.substring(1, 8) == 'uploads') {
                    fs.unlink('public' + oldPhoto, (err) => { })
                }
            }
            return res.send({
                code: 200,
                message: 'success',
                course: req.file ? {
                    _id: req.body.courseid,
                    name: req.body.name,
                    description: req.body.description,
                    coverphoto: '/uploads/courses-photo/' + req.file.filename,
                    genre: req.body.genre,
                    subgenre: req.body.subgenre,
                    level: req.body.level
                } : {
                        _id: req.body.courseid,
                        name: req.body.name,
                        description: req.body.description,
                        coverphoto: course.coverphoto,
                        genre: req.body.genre,
                        subgenre: req.body.subgenre,
                        level: req.body.level
                    }
            })
        })
    })
})
router.post('/set-course-price', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        Course.update({ _id: req.body.courseid }, {
            cost: req.body.cost
        }, { multi: false }, (err, course) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            return res.send({
                code: 200,
                message: 'success',
                course: {
                    _id: req.body.courseid,
                    cost: req.body.cost
                }
            })
        })
    })
})
router.post('/publish-course', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        Course.update({ _id: req.body.courseid }, {
            review: true
        }, { multi: false }, (err, course) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            return res.send({
                code: 200,
                message: 'success',
                course: {
                    _id: req.body.courseid,
                    review: true
                }
            })
        })
    })
})
router.post('/get-course-lectures', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        Course.findOne({ _id: req.body.courseid }).populate({
            path: 'lectures',
            select: '-__v -updatedAt -createdAt'
        }).exec((err, course) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            return res.send({
                code: 200,
                message: 'success',
                course: {
                    _id: req.body.courseid,
                    lectures: course.lectures
                }
            })
        })
    })
})
router.post('/add-course-lecture', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        let lecture = new Lecture({ name: req.body.name })
        lecture.save((err) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            Course.findByIdAndUpdate(
                req.body.courseid,
                { $push: { "lectures": lecture._id } },
                (err, course) => {
                    if (err)
                        return res.send({ code: 404, message: 'error' })
                    return res.send({
                        code: 200,
                        message: 'success',
                        lecture: {
                            _id: lecture._id,
                            name: lecture.name
                        }
                    })
                }
            )
        })
    })
})
router.post('/delete-course-lecture', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0) {
            return res.send({ code: 404, message: 'error' })
        }
        Course.count({ _id: req.body.courseid, lectures: { $elemMatch: { $eq: req.body.lectureid } } }).exec((err, data) => {
            if (err || data == 0) {
                return res.send({ code: 404, message: 'error' })
            }
            Lecture.findByIdAndRemove(req.body.lectureid, (err, lecture) => {
                if (err) {
                    return res.send({ code: 404, message: 'error' })
                }
                if (lecture.video)
                    fs.unlink(lecture.video, (err) => { })
                Course.update({ _id: req.body.courseid }, { $pull: { lectures: req.body.lectureid } }).exec((err, data) => {
                    if (err || data == 0) {
                        return res.send({ code: 404, message: 'error' })
                    }
                    return res.send({ code: 200, message: 'success' })
                })
            })
        })
    })
})
router.post('/upload-video-lecture', uploadcoursevideo.single('video'), (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0)
            return res.send({ code: 404, message: 'error' })
        Course.count({
            _id: req.body.courseid,
            lectures: {
                $elemMatch: {
                    $eq: req.body.lectureid
                }
            }
        }).exec((err, data) => {
            if (err || data == 0)
                return res.send({ code: 404, message: 'error' })
            Lecture.findByIdAndUpdate(req.body.lectureid, { video: 'uploads/courses-video/' + req.file.filename },
                (err, lecture) => {
                    if (err)
                        return res.send({ code: 404, message: 'error' })
                    if (lecture.video)
                        fs.unlink(lecture.video, (err) => { })
                    return res.send({
                        code: 200,
                        message: 'success',
                        lecture: {
                            _id: req.body.lectureid,
                            video: 'uploads/courses-video/' + req.file.filename
                        }
                    })
                })
        })
    })
})
router.post('/upload-preview-video-course', uploadcoursepreviewvideo.single('previewvideo'), (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0)
            return res.send({ code: 404, message: 'error' })
        Course.findByIdAndUpdate({ _id: req.body.courseid }, { previewvideo: '/uploads/courses-video/' + req.file.filename }).exec((err, data) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            if (data.previewvideo)
                fs.unlink('public' + data.previewvideo, (err) => { })
            return res.send({
                code: 200,
                message: 'success',
                previewvideo: '/uploads/courses-video/' + req.file.filename
            })
        })
    })
})
router.post('/set-lecture-name', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0)
            return res.send({ code: 404, message: 'error' })
        Course.count({
            _id: req.body.courseid,
            lectures: {
                $elemMatch: {
                    $eq: req.body.lectureid
                }
            }
        }).exec((err, data) => {
            if (err || data == 0)
                return res.send({ code: 404, message: 'error' })
            Lecture.findByIdAndUpdate(req.body.lectureid, { name: req.body.name },
                (err, lecture) => {
                    if (err)
                        return res.send({ code: 404, message: 'error' })
                    return res.send({
                        code: 200,
                        message: 'success',
                        lecture: {
                            _id: req.body.lectureid,
                            name: req.body.name
                        }
                    })
                })
        })
    })
})
router.post('/change-preview-lecture', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0)
            return res.send({ code: 404, message: 'error' })
        Course.count({
            _id: req.body.courseid,
            lectures: {
                $elemMatch: {
                    $eq: req.body.lectureid
                }
            }
        }).exec((err, data) => {
            if (err || data == 0)
                return res.send({ code: 404, message: 'error' })
            Lecture.findOne({ _id: req.body.lectureid }).exec((err, data) => {
                if (err)
                    return res.send({ code: 404, message: 'error' })
                data.preview = !data.preview
                data.save((err) => {
                    if (err)
                        return res.send({ code: 404, message: 'error' })
                    return res.send({
                        code: 200,
                        message: 'success',
                        lecture: {
                            _id: req.body.lectureid,
                            preview: data.preview
                        }
                    })

                })
            })
        })
    })
})
router.post('/delete-course', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mycourses: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err || data == 0)
            return res.send({ code: 404, message: 'error' })
        User.update({ _id: req.user._id }, { $pull: { mycourses: req.body.courseid } }).exec((err, raw) => {
            if (err) {
                return res.send({ code: 404, message: 'error' })
            }
            Course.findByIdAndRemove({ _id: req.body.courseid }).populate({
                path: 'lectures'
            }).exec((err, data) => {
                if (err)
                    return res.send({ code: 404, message: 'error' })
                if (data.coverphoto && data.coverphoto.substring(1, 8) == 'uploads') {
                    fs.unlink('public' + data.coverphoto, (err) => { })
                }
                let removeLecturePromises = data.lectures.map((lecture) => {
                    return new Promise((res, rej) => {
                        if (lecture.video) {
                            fs.unlink(lecture.video, (err) => { })
                        }
                        Lecture.remove({ _id: lecture._id }).exec((err) => {
                            if (err) return rej(err)
                            res()
                        })
                    })
                })
                Promise.all(removeLecturePromises).then(() => {
                    return res.send({ code: 200, message: 'success' })
                })
            })
        })
    })
})
router.post('/change-wishlist', (req, res, next) => {
    User.count({
        _id: req.user._id,
        mywishlist: {
            $elemMatch: {
                $eq: req.body.courseid
            }
        }
    }).exec((err, data) => {
        if (err) return res.send({ code: 404, message: 'error' })
        if (data == 0) {
            User.update({ _id: req.user.id }, { $push: { "mywishlist": req.body.courseid } }, (err) => {
                if (err) return res.send({ code: 404, message: 'error' })
                return res.send({ code: 200, message: 'success', action: 'add' })
            })
        } else {
            User.update({ _id: req.user.id }, { $pull: { "mywishlist": req.body.courseid } }, (err) => {
                if (err) return res.send({ code: 404, message: 'error' })
                return res.send({ code: 200, message: 'success', action: 'remove' })
            })
        }
    })
})
router.post('/take-a-course', (req, res, next) => {
    if (_.includes(JSON.stringify(req.user.mylearningcourses), req.body.courseid)) {
        return res.send({ code: 404, message: 'error' })
    } else {
        Course.findOne({ _id: req.body.courseid })
            .populate({ path: 'lecturer', select: { _id: 1 } })
            .exec((err, course) => {
                if (err || !course) return res.send({ code: 404, message: 'error' })
                if (req.user.creditbalance < course.cost) return res.send({ code: 404, message: 'The credit balance is not enough to make payments' })
                User.update({ _id: req.user._id }, {
                    $push: { mylearningcourses: req.body.courseid },
                    $inc: { creditbalance: -course.cost }
                }, (err) => {
                    if (err)
                        return res.send({ code: 404, message: 'error' })
                    fs.readFile('config.json', (err, data) => {
                        if (err) throw err
                        let config = JSON.parse(data.toString())
                        User.update({ _id: course.lecturer._id },
                            { $inc: { creditbalance: course.cost * (100.0 - parseFloat(config.PROFIT_RATIO)) / 100.0 } },
                            (err) => { })
                        config.TOTAL_PROFIT = parseFloat(config.TOTAL_PROFIT) + course.cost * parseFloat(config.PROFIT_RATIO) / 100.0
                        fs.writeFile('config.json', JSON.stringify(config), (err) => { })
                    })
                    let noti = new Notification({
                        from: req.user._id,
                        to: course.lecturer._id,
                        title: 'Congratulation!',
                        message: req.user.username + ' has enrolled in ' + course.name + ' course',
                        url: '/managecourse/' + req.body.courseid + '/goals',
                    })
                    noti.save((err) => { })
                    Course.update({ _id: req.body.courseid }, { $inc: { numberofstudent: 1, revenue: course.cost } }, (err) => { })
                    return res.send({ code: 200, message: 'success' })
                })
            })
    }
})
router.post('/learning', (req, res, next) => {
    let mylearningcourses = req.user.mylearningcourses

    let condition = { _id: { $in: mylearningcourses }, public: true }
    if (req.body.level)
        condition.level = req.body.level
    if (req.body.free)
        condition.cost = req.body.free == 'true' ? 0 : { $gt: 0 }
    if (req.body.name)
        condition.name = { $regex: ('.*' + req.body.name + '.*'), $options: 'i' }

    let sort
    if (!req.body.sort)
        sort = { name: 1 }
    else {
        switch (parseInt(req.body.sort)) {
            case 1:
                sort = { name: 1 }
                break
            case 2:
                sort = { name: -1 }
                break
        }
    }
    Course.find(condition)
        .populate({ path: 'lecturer', select: '-_id username photo' })
        .select({ _id: 1, name: 1, coverphoto: 1, cost: 1, numberofstudent: 1, numberofreviews: 1, star: 1, lecturer: 1, description: 1 })
        .skip((req.body.page || 1) * 8 - 8)
        .limit(8).sort(sort).exec((err, courses) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            res.send({ code: 200, courses: courses })
        })
})
router.post('/wishlist', (req, res, next) => {
    let mywishlist = req.user.mywishlist

    let condition = { _id: { $in: mywishlist }, public: true }
    if (req.body.level)
        condition.level = req.body.level
    if (req.body.free)
        condition.cost = req.body.free == 'true' ? 0 : { $gt: 0 }
    if (req.body.name)
        condition.name = { $regex: ('.*' + req.body.name + '.*'), $options: 'i' }

    let sort
    if (!req.body.sort)
        sort = { name: 1 }
    else {
        switch (parseInt(req.body.sort)) {
            case 1:
                sort = { name: 1 }
                break
            case 2:
                sort = { name: -1 }
                break
        }
    }
    Course.find(condition)
        .populate({ path: 'lecturer', select: '-_id username photo' })
        .select({ _id: 1, name: 1, coverphoto: 1, cost: 1, numberofstudent: 1, numberofreviews: 1, star: 1, lecturer: 1, description: 1 })
        .skip((req.body.page || 1) * 8 - 8)
        .limit(8).sort(sort).exec((err, courses) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            res.send({ code: 200, courses: courses })
        })
})
router.post('/get-notis', (req, res, next) => {
    Notification.find({ to: req.user._id })
        .populate({ path: 'from', select: { photo: 1 } })
        .select({ __v: 0, updatedAt: 0, to: 0 })
        .skip((req.body.page || 1) * 4 - 4)
        .limit(4).sort({ createdAt: -1 }).exec((err, notis) => {
            if (err)
                res.send({ code: 404, message: 'error' })
            res.send({ code: 200, notis: notis })
        })
})
router.get('/mark-all-read-noti', (req, res, next) => {
    Notification.update({ seen: false, to: req.user._id }, { seen: true }, { multi: true }).exec((err) => { })
})
router.post('/mark-read-noti', (req, res, next) => {
    Notification.update({ seen: false, to: req.user._id, _id: req.body.id }, { seen: true }).exec((err) => { })
})
router.post('/get-payment', (req, res, next) => {
    Payment.find({ user: req.user._id })
        .populate({ path: 'information.course', select: { name: 1 } })
        .populate({ path: 'information.user', select: { username: 1 } })
        .skip((req.body.page || 1) * 8 - 8)
        .limit(8).sort({ createdAt: req.body.sort == 0 ? -1 : 1 })
        .exec((err, payments) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            res.send({ code: 200, payments: payments })
        })
})
router.post('/delete-payment', (req, res, next) => {
    Payment.remove({ _id: req.body._id }).exec((err) => { })
    res.end()
})
router.post('/deposit-funds', (req, res, next) => {
    User.update({ _id: req.user._id }, { $inc: { creditbalance: req.body.money } }).exec((err) => {
        if (err)
            return res.send({ code: 404, message: 'error' })
        let payment = new Payment({
            user: req.user._id,
            type: 1,
            money: req.body.money
        })
        payment.save((err) => { })
        res.send({ code: 200 })
    })
})

router.post('/withdraw', (req, res, next) => {
    if (!req.user.paypalid || req.user.paypalid == '')
        return res.send({ code: 404, message: 'You must set your PayPal-Id' })
    if (req.user.creditbalance < req.body.money)
        return res.send({ code: 404, message: 'The credit balance is not enough to make payments' })
    User.update({ _id: req.user._id }, { $inc: { creditbalance: -req.body.money } }).exec((err) => {
        if (err)
            return res.send({ code: 404, message: 'error' })
        let payment = new Payment({
            user: req.user._id,
            type: 0,
            money: req.body.money
        })
        payment.save((err) => { })
        res.send({ code: 200 })
    })
})
router.post('/set-paypalid', (req, res, next) => {
    User.update({ _id: req.user._id }, { paypalid: req.body.paypalid }).exec((err) => {
        if (err)
            return res.send({ code: 404, message: 'error' })
        res.send({ code: 200 })
    })
})

module.exports = router;
