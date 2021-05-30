import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { setUser, setCourse, setGetMyCourses, publishCourse } from '../actions'
var _ = require('lodash')

class ManageCourse extends React.Component {

    componentDidMount() {
        if (!this.props.course) {
            // $.post('/api/user/get-course',
            $.post('http://localhost:5000/users/get-course',
                { courseid: this.props.params.id },
                (data, status) => {
                    if (data.code == 200) {
                        this.props.dispatch(setCourse(data.course))
                    }
                })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.params.id != nextProps.params.id) {
            // $.post('/api/user/get-course',
            $.post('http://localhost:5000/users/get-course',
                { courseid: nextProps.params.id },
                (data, status) => {
                    if (data.code == 200) {
                        this.props.dispatch(setCourse(data.course))
                    }
                })
        }
    }
    onClickPublish() {
        // $.post('/api/user/publish-course',
        $.post('http://localhost:5000/users/publish-course',
            {
                courseid: this.props.params.id
            },
            (data, status) => {
                if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    return browserHistory.push('/')
                }
                if (data.code == 200) {
                    this.props.dispatch(publishCourse(data.course))
                }
            })
    }

    render() {
        if (!this.props.course) {
            return <div></div>
        }
        return (
            <div>
                <div className="row managecourse-header-box">
                    <div className="container">
                        <img className="managecourse-header-image" src={'/api/resource/images?src=' + this.props.course.coverphoto + '&w=130&h=73'} />
                        {<div className="managecourse-header-detail">
                            <h4><strong>{this.props.course.name}</strong></h4>
                            <h5>{this.props.username}</h5>
                            <h4><strong>{this.props.course.public ? 'Public' : 'Draft'}</strong></h4>
                        </div>}
                    </div>
                </div>
                <div className="container">
                    <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 sidebar-profile">
                        <ul className="menu-profile">
                            <li>
                                <Link to={'/managecourse/' + this.props.course._id + '/goals'} activeClassName="active"
                                    onlyActiveOnIndex={true}><span className='glyphicon glyphicon-screenshot'></span>{' '}Course Goals</Link>
                            </li>
                            <li>
                                <Link to={'/managecourse/' + this.props.course._id + '/lectures'} activeClassName="active"
                                    onlyActiveOnIndex={true}><span className='glyphicon glyphicon-list-alt'></span>{' '}Lectures</Link>
                            </li>
                            <li>
                                <Link to={'/managecourse/' + this.props.course._id + '/description'} activeClassName="active"
                                    onlyActiveOnIndex={true}><span className='glyphicon glyphicon-info-sign'></span>{' '}Description</Link>
                            </li>
                            <li>
                                <Link to={'/managecourse/' + this.props.course._id + '/price'} activeClassName="active"
                                    onlyActiveOnIndex={true}><span className='glyphicon glyphicon-shopping-cart'></span>{' '}Price</Link>
                            </li>
                            <li>
                                <Link to={'/managecourse/' + this.props.course._id + '/danger-zone'} activeClassName="active"
                                    onlyActiveOnIndex={true}><span className='glyphicon glyphicon-trash'></span>{' '}Danger Zone</Link>
                            </li>
                        </ul>
                        <button className="btn btn-lg btn-block btn-info button-submit-review"
                            disabled={this.props.course.review} onClick={this.onClickPublish.bind(this)}>
                            <span className='glyphicon glyphicon-share'></span>{this.props.course.review ? ' Being Reviewed' : ' Publish'}
                        </button>
                    </div>

                    <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 bg-success edit-user-box">
                        {this.props.children}
                    </div >
                </div>
            </div>
        )
    }
}

ManageCourse = connect((state, props) => {
    if (state.user.mycourses) {
        let course = _.find(state.user.mycourses, { _id: props.params.id })
        if (course)
            return {
                course: { _id: course._id, name: course.name, public: course.public, coverphoto: course.coverphoto, review: course.review },
                username: state.user.username
            }
    }
    return props
})(ManageCourse)

export default ManageCourse