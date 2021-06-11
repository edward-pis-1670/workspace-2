import { ActionTypes } from '../constants'
var _ = require('lodash')

const setUser = (state = {}, action) => {
    let newState = Object.assign({}, state)
    switch (action.type) {
        case ActionTypes.SET_USER:
            return action.user
        case ActionTypes.SET_PHOTO:
            newState.photo = action.photo
            return newState
        case ActionTypes.SET_PROFILE:
            newState.username = action.profile.username
            newState.biography = action.profile.biography
            newState.website = action.profile.website
            newState.twitter = action.profile.twitter
            newState.linkedin = action.profile.linkedin
            newState.youtube = action.profile.youtube
            return newState
        case ActionTypes.CREATE_COURSE:
            if (newState.mycourses)
                newState.mycourses = [action.course, ...newState.mycourses]
            else
                newState.mycourses = [action.course]
            return newState
        case ActionTypes.GET_ALL_MYCOURSES:
            newState.mycourses = action.mycourses
            return newState
        case ActionTypes.SET_COURSE_GOALS:
            if (!newState.mycourses || newState.mycourses.length == 0) {
                newState.mycourses = [];
                newState.mycourses[0] = action.course
            } else {
                let index = _.findIndex(newState.mycourses, { '_id': action.course._id })
                if (index < 0) {
                    newState.mycourses = [action.course, ...newState.mycourses]
                } else {
                    newState.mycourses[index].needtoknow = action.course.needtoknow
                    newState.mycourses[index].targetstudent = action.course.targetstudent
                    newState.mycourses[index].willableto = action.course.willableto
                }
            }
            return newState
        case ActionTypes.SET_COURSE_DESCRIPTION:
            if (!newState.mycourses || newState.mycourses.length == 0) {
                newState.mycourses = [];
                newState.mycourses[0] = action.course
            } else {
                let index = _.findIndex(newState.mycourses, { '_id': action.course._id })
                if (index < 0) {
                    newState.mycourses = [action.course, ...newState.mycourses]
                } else {
                    newState.mycourses[index].name = action.course.name
                    newState.mycourses[index].description = action.course.description
                    if (action.course.previewvideo)
                        newState.mycourses[index].previewvideo = action.course.previewvideo
                    newState.mycourses[index].coverphoto = action.course.coverphoto
                    newState.mycourses[index].genre = action.course.genre
                    newState.mycourses[index].subgenre = action.course.subgenre
                    newState.mycourses[index].level = action.course.level
                }
            }
            return newState
        case ActionTypes.SET_COURSE_PRICE:
            if (!newState.mycourses || newState.mycourses.length == 0) {
                newState.mycourses = [];
                newState.mycourses[0] = action.course
            } else {
                let index = _.findIndex(newState.mycourses, { '_id': action.course._id })
                if (index < 0) {
                    newState.mycourses = [action.course, ...newState.mycourses]
                } else {
                    newState.mycourses[index].cost = action.course.cost
                }
            }
            return newState
        case ActionTypes.SET_COURSE_PREVIEW_VIDEO:
            if (!newState.mycourses || newState.mycourses.length == 0) {
                newState.mycourses = [];
                newState.mycourses[0] = { _id: action.courseid, previewvideo: action.previewvideo }
            } else {
                let index = _.findIndex(newState.mycourses, { '_id': action.courseid })
                if (index < 0) {
                    newState.mycourses = [{ _id: action.courseid, previewvideo: action.previewvideo }, ...newState.mycourses]
                } else {
                    newState.mycourses[index].previewvideo = action.previewvideo
                }
            }
            return newState
        case ActionTypes.SET_COURSE_LECTURES:
            if (!newState.mycourses || newState.mycourses.length == 0) {
                newState.mycourses = [];
                newState.mycourses[0] = action.course
            } else {
                let index = _.findIndex(newState.mycourses, { '_id': action.course._id })
                if (index < 0) {
                    newState.mycourses = [action.course, ...newState.mycourses]
                } else {
                    newState.mycourses[index].lectures = action.course.lectures
                }
            }
            return newState
        case ActionTypes.ADD_LECTURE:
            let index = _.findIndex(newState.mycourses, { '_id': action.courseid })
            if (newState.mycourses[index].lectures)
                newState.mycourses[index].lectures = [...newState.mycourses[index].lectures, action.lecture]
            else
                newState.mycourses[index].lectures = [action.lecture]
            return newState
        case ActionTypes.DELETE_LECTURE:
            let indexc = _.findIndex(newState.mycourses, { '_id': action.courseid })
            let indexl = _.findIndex(newState.mycourses[indexc].lectures, { '_id': action.lectureid })
            newState.mycourses[indexc].lectures = [
                ...newState.mycourses[indexc].lectures.slice(0, indexl),
                ...newState.mycourses[indexc].lectures.slice(indexl + 1)
            ]
            return newState
        case ActionTypes.SET_LECTURE_VIDEO:
            let idc = _.findIndex(newState.mycourses, { '_id': action.courseid })
            let idl = _.findIndex(newState.mycourses[idc].lectures, { '_id': action.lecture._id })
            let lecture = newState.mycourses[idc].lectures[idl]
            lecture.video = action.lecture.video
            newState.mycourses[idc].lectures = [
                ...newState.mycourses[idc].lectures.slice(0, idl),
                lecture,
                ...newState.mycourses[idc].lectures.slice(idl + 1)
            ]
            return newState
        case ActionTypes.SET_LECTURE_NAME:
            let idcn = _.findIndex(newState.mycourses, { '_id': action.courseid })
            let idln = _.findIndex(newState.mycourses[idcn].lectures, { '_id': action.lecture._id })
            let lecturen = newState.mycourses[idcn].lectures[idln]
            lecturen.name = action.lecture.name
            newState.mycourses[idcn].lectures = [
                ...newState.mycourses[idcn].lectures.slice(0, idln),
                lecturen,
                ...newState.mycourses[idcn].lectures.slice(idln + 1)
            ]
            return newState
        case ActionTypes.SET_LECTURE_PREVIEW:
            let idcp = _.findIndex(newState.mycourses, { '_id': action.courseid })
            let idlp = _.findIndex(newState.mycourses[idcp].lectures, { '_id': action.lecture._id })
            let lecturep = newState.mycourses[idcp].lectures[idlp]
            lecturep.preview = action.lecture.preview
            newState.mycourses[idcp].lectures = [
                ...newState.mycourses[idcp].lectures.slice(0, idlp),
                lecturep,
                ...newState.mycourses[idcp].lectures.slice(idlp + 1)
            ]
            return newState
        case ActionTypes.SET_COURSE:
            if (!newState.mycourses || newState.mycourses.length == 0) {
                newState.mycourses = [];
                newState.mycourses[0] = action.course
            } else {
                let index = _.findIndex(newState.mycourses, { '_id': action.course._id })
                if (index < 0) {
                    newState.mycourses = [action.course, ...newState.mycourses]
                } else {
                    newState.mycourses[index].name = action.course.name
                    newState.mycourses[index].public = action.course.public
                    newState.mycourses[index].cost = action.course.cost
                }
            }
            return newState
        case ActionTypes.PUBLISH_COURSE:
            if (!newState.mycourses || newState.mycourses.length == 0) {
                newState.mycourses = [];
                newState.mycourses[0] = action.course
            } else {
                let index = _.findIndex(newState.mycourses, { '_id': action.course._id })
                if (index < 0) {
                    newState.mycourses = [action.course, ...newState.mycourses]
                } else {
                    newState.mycourses[index].review = true
                }
            }
            return newState
        case ActionTypes.DELETE_COURSE:
            if (newState.mycourses && newState.mycourses.length > 0) {
                let index = _.findIndex(newState.mycourses, { '_id': action.courseid })
                if (index >= 0) {
                    newState.mycourses = [
                        ...newState.mycourses.slice(0, index),
                        ...newState.mycourses.slice(index + 1)
                    ]
                }
            }
            return newState
        case ActionTypes.CHANGE_WISHLIST:
            if (action.typeAction == 'add') {
                newState.mywishlist = [...newState.mywishlist, action.courseid]
            } else if (action.typeAction == 'remove') {
                let index = _.findIndex(newState.mywishlist, (o) => { return o == action.courseid })
                if (index >= 0) {
                    newState.mywishlist = [
                        ...newState.mywishlist.slice(0, index),
                        ...newState.mywishlist.slice(index + 1)
                    ]
                }
            }
            return newState
        case ActionTypes.TAKE_COURSE:
            if (!newState.mylearningcourses || newState.mylearningcourses.length == 0) {
                newState.mylearningcourses = [];
                newState.mylearningcourses[0] = action.courseid
                newState.creditbalance = newState.creditbalance - action.cost
            } else {
                if (!_.includes(newState.mylearningcourses, action.courseid)) {
                    newState.mylearningcourses = [
                        ...newState.mylearningcourses,
                        action.courseid
                    ]
                    newState.creditbalance = newState.creditbalance - action.cost
                }
            }
            return newState
        case ActionTypes.MARK_ALL_AS_READ:
            newState.notis = newState.notis.map((noti) => {
                noti.seen = true
                return noti
            })
            return newState
        case ActionTypes.MARK_READ:
            if (newState.notis) {
                let i = _.findIndex(newState.notis, (o) => { return !o.seen && o._id == action.id })
                if (i < 0)
                    return newState
                let noti = newState.notis[i]
                noti.seen = true
                newState.notis = [...newState.notis.slice(0, i), noti, ...newState.notis.slice(i + 1)]
            }
            return newState
        case ActionTypes.DEPOSIT_FUNDS:
            newState.creditbalance = newState.creditbalance + action.money
            return newState
        case ActionTypes.WITH_DRAW:
            newState.creditbalance = newState.creditbalance - action.money
            return newState
        case ActionTypes.SET_PAYPALID:
            newState.paypalid = action.paypalid
            return newState
        default: return state
    }
}

const showModal = (state = 0, action) => {
    switch (action.type) {
        case ActionTypes.SHOW_MODAL:
            return action.id
        default: return state
    }
}
const setGenres = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.SET_GENRES:
            return action.genres
        default: return state
    }
}
const setGetMyCourses = (state = false, action) => {
    switch (action.type) {
        case ActionTypes.SET_GETMYCOURSES:
            return action.done
        default: return state
    }
}
const setViewCourses = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_VIEW_COURSE:
            return [...state, action.course]
        case ActionTypes.TAKE_COURSE:
            let index = _.findIndex(state, (o) => { return o == action.courseid })
            if (index >= 0) {
                console.log(courseid)
                let course = state[index]
                course.numberofstudent += 1
                return [...state.splice(0, index), course, ...state.splice(index + 1)]
            }
        default: return state
    }
}
export { showModal, setUser, setGenres, setGetMyCourses, setViewCourses }