var express = require('express')
var router = express.Router()

var User = require('../../models/user')
var Course = require('../../models/course')
var Lecture = require('../../models/lecture')
var Review = require('../../models/review')
var Notification = require('../../models/notification')
var _ = require('lodash')

var send = require('send')

router.post('/get-course-info/', (req, res, next) => {
    Course.findOne({ _id: req.body.courseid })
        .select({ __v: 0, updatedAt: 0 })
        .populate({ path: 'lecturer', select: '_id username photo twitter website youtube linkedin facebookid googleid biography' })
        .populate({ path: 'lectures', select: '-__v -updatedAt -createdAt' })
        .populate({ path: 'genre', select: '_id name' })
        .populate({ path: 'subgenre', select: '_id name' })
        .populate({ path: 'reviews.user', select: '_id username photo' })
        .exec((err, data) => {
            if (err || !data)
                return res.send({ code: 404, message: 'error' })
            return res.send({
                code: 200,
                message: 'success',
                course: data
            })
        })
})
router.post('/get-review', (req, res, next) => {
    Review.find({ course: req.body.courseid }).
        populate({ path: 'user', select: '_id username photo' })
        .select({ __v: 0, updatedAt: 0, course: 0, _id: 0 })
        .skip((req.body.page || 1) * 8 - 8)
        .limit(8).sort({ createdAt: -1 }).exec((err, reviews) => {
            if (err)
                return res.send({ code: 404, message: 'error' })
            res.send({ code: 200, reviews: reviews })
        })

})
router.post('/add-review', (req, res, next) => {
    if (!req.isAuthenticated())
        return res.send({ code: 1001, message: 'Account is not logged in' })
    if (!_.includes(JSON.stringify(req.user.mylearningcourses), req.body.courseid))
        return res.send({ code: 404, message: 'error' })
    let review = new Review({
        user: req.user._id,
        course: req.body.courseid,
        content: req.body.content,
        star: req.body.star
    })
    review.save((err) => {
        if (err)
            return res.send({ code: 404, message: 'error' })
        Course.findOne({ _id: req.body.courseid })
            .populate({ path: 'lecturer', select: { _id: 1 } })
            .exec((err, course) => {
                let star = course.star ? parseFloat(course.star) : 0
                let numberofreviews = course.numberofreviews ? parseInt(course.numberofreviews) : 0
                star = (star * numberofreviews + parseInt(req.body.star)) / (numberofreviews + 1)
                numberofreviews++
                course.star = star
                course.numberofreviews = numberofreviews
                course.save((err) => {
                    if (err)
                        return res.send({ code: 404, message: 'error' })
                    let noti = new Notification({
                        from: req.user._id,
                        to: course.lecturer._id,
                        title: req.body.star + ' star!',
                        message: req.user.username + ' has reviewed in ' + course.name + ' course',
                        url: '/course/' + req.body.courseid,
                    })
                    noti.save((err) => { })
                    res.send({ code: 200, message: 'success' })
                })
            })
    })

})

module.exports = router;
