import { combineReducers } from 'redux';
import { setUser, showModal, setGenres, setGetMyCourses, setViewCourses } from './navbar';

const rootReducer = combineReducers({
    user: setUser,
    showModalId: showModal,
    genreList: setGenres,
    getMyCourses: setGetMyCourses,
    viewCourses: setViewCourses
});

export default rootReducer;