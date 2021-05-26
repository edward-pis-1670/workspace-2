require('dotenv').config();
var http = require('http');
var fs = require('fs');//Handle files
var mongoose = require('mongoose');
var db = mongoose.connection;
var Course = require('../models/course')
var User = require('../models/user')
var Payment = require('../models/payment')

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    updatePayment()
})
updatePayment = () => {
    User.find({}).exec((err, users) => {
        for (let i = 0; i < users.length; i++) {
            let user = users[i]
            let jmax = Math.max(10, Math.floor(Math.random() * 100))
            for (let j = 0; j < jmax; j++) {
                let type = Math.floor(Math.random() * 4)
                let information = {}
                if (type == 2) {
                    let u = users[Math.floor(Math.random() * users.length)]
                    if (u.mycourses) {
                        if (u.mycourses.length > 0) {
                            information = {
                                user: u._id,
                                course: u.mycourses[Math.floor(Math.random() * u.mycourses.length)]
                            }
                        } else {
                            type = 0
                        }
                    } else {
                        type = 0
                    }
                } else if (type == 3) {
                    if (user.mycourses) {
                        if (user.mycourses.length > 0) {
                            let u = users[Math.floor(Math.random() * users.length)]
                            information = {
                                user: u._id,
                                course: user.mycourses[Math.floor(Math.random() * user.mycourses.length)]
                            }
                        } else {
                            type = 1
                        }
                    } else {
                        type = 1
                    }
                }
                let payment = new Payment({
                    user: user._id,
                    type: type,
                    information: information,
                    money: Math.floor(Math.random() * 1000)
                })
                payment.save((err) => { })
            }
        }
    })
}


mongoose.connect(process.env.MONGODB_URL);
