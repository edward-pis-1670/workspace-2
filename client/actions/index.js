import { ActionTypes } from '../constants'

export function setUser(user) {
    return {
        type: ActionTypes.SET_USER,
        user
    }
}
export function setPhoto(photo) {
    return {
        type: ActionTypes.SET_PHOTO,
        photo
    }
}
export function setProfile(profile) {
    return {
        type: ActionTypes.SET_PROFILE,
        profile
    }
}
export function createCourse(course) {
    return {
        type: ActionTypes.CREATE_COURSE,
        course
    }
}
export function getAllMyCourses(mycourses) {
    return {
        type: ActionTypes.GET_ALL_MYCOURSES,
        mycourses
    }
}

export function setCourseGoals(course) {
    return {
        type: ActionTypes.SET_COURSE_GOALS,
        course
    }
}
export function setCourseDescription(course) {
    return {
        type: ActionTypes.SET_COURSE_DESCRIPTION,
        course
    }
}
export function setCoursePrice(course) {
    return {
        type: ActionTypes.SET_COURSE_PRICE,
        course
    }
}
export function setCoursePreviewVideo(previewvideo, courseid) {
    return {
        type: ActionTypes.SET_COURSE_PREVIEW_VIDEO,
        previewvideo,
        courseid
    }
}
export function setCourseLectures(course) {
    return {
        type: ActionTypes.SET_COURSE_LECTURES,
        course
    }
}
export function addLecture(lecture, courseid) {
    return {
        type: ActionTypes.ADD_LECTURE,
        lecture,
        courseid
    }
}
export function deleteLecture(lectureid, courseid) {
    return {
        type: ActionTypes.DELETE_LECTURE,
        lectureid,
        courseid
    }
}
export function setLectureVideo(lecture, courseid) {
    return {
        type: ActionTypes.SET_LECTURE_VIDEO,
        lecture,
        courseid
    }
}
export function setLectureName(lecture, courseid) {
    return {
        type: ActionTypes.SET_LECTURE_NAME,
        lecture,
        courseid
    }
}
export function setLecturePreview(lecture, courseid) {
    return {
        type: ActionTypes.SET_LECTURE_PREVIEW,
        lecture,
        courseid
    }
}
export function setCourse(course) {
    return {
        type: ActionTypes.SET_COURSE,
        course
    }
}
export function publishCourse(course) {
    return {
        type: ActionTypes.PUBLISH_COURSE,
        course
    }
}

export function deleteCourse(courseid) {
    return {
        type: ActionTypes.DELETE_COURSE,
        courseid
    }
}
export function changeWishlist(typeAction, courseid) {
    return {
        type: ActionTypes.CHANGE_WISHLIST,
        typeAction,
        courseid
    }
}
export function takeCourse(courseid, cost) {
    return {
        type: ActionTypes.TAKE_COURSE,
        courseid,
        cost
    }
}
export function markAllAsRead() {
    return {
        type: ActionTypes.MARK_ALL_AS_READ
    }
}
export function markRead(id) {
    return {
        type: ActionTypes.MARK_READ,
        id
    }
}
export function depositFunds(money) {
    return {
        type: ActionTypes.DEPOSIT_FUNDS,
        money
    }
}
export function withDraw(money) {
    return {
        type: ActionTypes.WITH_DRAW,
        money
    }
}
export function setPaypalId(paypalid) {
    return {
        type: ActionTypes.SET_PAYPALID,
        paypalid
    }
}






export function showModal(id) {
    return {
        type: ActionTypes.SHOW_MODAL,
        id
    }
}
export function setGenres(genres) {
    return {
        type: ActionTypes.SET_GENRES,
        genres
    }
}
export function setGetMyCourses(done) {
    return {
        type: ActionTypes.SET_GETMYCOURSES,
        done
    }
}



export function addViewCourse(course) {
    return {
        type: ActionTypes.ADD_VIEW_COURSE,
        course
    }
}