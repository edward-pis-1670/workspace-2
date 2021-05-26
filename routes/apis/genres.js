var express = require('express');
var router = express.Router();
var Genre = require('../../models/genre');

/* GET users listing. */
router.get('/all', function (req, res, next) {
    Genre.find().select({ __v: 0}).populate({
        path: 'subgenres',
        select: '-__v -genre',
    }).exec(function (err, genres) {
        if (err) return handleError(err);
        res.end(JSON.stringify(genres));
    });
});

module.exports = router;