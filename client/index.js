import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import Navbar from './containers/navbar'
import Sidebar from './components/sidebar'
import Background from './components/background'
//User
import EditUser from './containers/edit-user'
import EditProfile from './containers/edit-profile'
import EditPhoto from './containers/edit-photo'
import EditAccount from './containers/edit-account'
import EditDangerZone from './containers/edit-danger-zone'
import EditCredit from './containers/edit-credit'
//VerifyEmail
import VerifyEmail from './containers/verify-email'
//Instructor
import Instructor from './containers/instructor-dashboard'
//ManageCourse
import ManageCourse from './containers/manage-course'
import ManageCourseGoal from './containers/manage-course-goal'
import ManageCourseDescription from './containers/manage-course-description'
import ManageCoursePrice from './containers/manage-course-price'
import ManageCourseLecture from './containers/manage-course-lecture'
import ManageCourseDangerZone from './containers/manage-course-danger-zone'

//ViewCourse
import ViewCourse from './containers/view-course'
import LearnCourse from './containers/learn-course'

//Courses
import HomepageContent from './components/homepage-content'
import CoursesGenre from './components/courses-genre'
import CoursesSubgenre from './components/courses-subgenre'
import CoursesSearch from './components/courses-search'

//MyCourses
import Learning from './containers/learning'
import Wishlist from './containers/wishlist'

//User
import ViewUser from './components/view-user'

//Notifications
import Notifications from './components/notifications'
//Admin
import Admin from './components/admin'
import AdminUser from './components/admin-user'
import AdminCourse from './components/admin-course'
import AdminReviewCourse from './components/admin-review-course'
import AdminCredit from './components/admin-credit'

//PDFViewer
import PDFViewer from './components/PDF-viewer'

import { Router, Route, browserHistory, IndexRoute } from 'react-router'


const store = createStore(rootReducer)

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path="/" component={Navbar}>
                <IndexRoute component={Background} />
                <Route path="/courses" component={Sidebar}>
                    <IndexRoute component={HomepageContent} />
                    <Route path='/courses/search' component={CoursesSearch} />
                    <Route path='/courses/:genreid' component={CoursesGenre} />
                    <Route path='/courses/:genreid/:subgenreid' component={CoursesSubgenre} />
                </Route>
                <Route path="/course/:id">
                    <IndexRoute component={ViewCourse} />
                    <Route path='/course/:id/learning' component={LearnCourse} />
                </Route>
                <Route path="/user" component={EditUser}>
                    <Route path="/user/edit-profile" component={EditProfile} />
                    <Route path="/user/edit-photo" component={EditPhoto} />
                    <Route path="/user/edit-account" component={EditAccount} />
                    <Route path="/user/edit-danger-zone" component={EditDangerZone} />
                    <Route path="/user/edit-credit" component={EditCredit} />
                </Route>
                <Route path="/instructor" component={Instructor}>
                </Route>
                <Route path="/managecourse/:id" component={ManageCourse}>
                    <Route path="/managecourse/:id/goals" component={ManageCourseGoal} />
                    <Route path="/managecourse/:id/description" component={ManageCourseDescription} />
                    <Route path="/managecourse/:id/price" component={ManageCoursePrice} />
                    <Route path="/managecourse/:id/lectures" component={ManageCourseLecture} />
                    <Route path="/managecourse/:id/danger-zone" component={ManageCourseDangerZone} />
                </Route>
                <Route path="/mycourses">
                    <Route path="/mycourses/learning" component={Learning} />
                    <Route path="/mycourses/wishlist" component={Wishlist} />
                </Route>
                <Route path="/verify/:verifytoken" component={VerifyEmail} />
                <Route path="/view-user/:id" component={ViewUser} />
                <Route path="/notifications" component={Notifications} />
                <Route path="/admin" component={Admin}>
                    <Route path="/admin/users" component={AdminUser} />
                    <Route path="/admin/courses" component={AdminCourse} />
                    <Route path="/admin/review-courses" component={AdminReviewCourse} />
                    <Route path="/admin/credit" component={AdminCredit} />
                </Route>
                {/*Test*/}
                <Route path='/viewpdf' component={PDFViewer} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
)
