import React from 'react'
import { connect } from 'react-redux'
import { setUser, setGetMyCourses, deleteCourse } from '../actions'
import { browserHistory } from 'react-router'

class ManageCourseDangerZone extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            isSubmitting: false,
        }
    }
    onClickDeleteCourse(e) {
        e.preventDefault()
        this.setState({ isSubmitting: true })
        $.post('/api/user/delete-course',
            {
                courseid: this.props.params.id
            }, (data, status) => {
                if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    return browserHistory.push('/')
                }
                if (data.code == 200) {
                    browserHistory.push('/instructor')
                    return this.props.dispatch(deleteCourse(this.props.params.id))
                }
                let alertlogin = $(".alert:first")
                alertlogin.show(500, function () {
                    setTimeout(function () {
                        alertlogin.hide(500)
                    }, 3000)
                })
                this.setState({ message: data.message, isSubmitting: false })
            })
    }

    render() {
        return (
            <form onSubmit={this.onClickDeleteCourse.bind(this)}>
                <div className="managecourse-title-box">
                    <h1><em>Delete Course</em></h1>
                </div>
                <div>
                    <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                    <div className="h5">
                        <strong className="text-danger">Warning: </strong>
                        Are you sure you want to delete this course?
                    </div>
                    <button type="super" disabled={this.state.isSubmitting}
                        className="btn-inline btn btn-danger center-block" >
                        <span className='glyphicon glyphicon-trash'></span>{' '}Delete
                    </button>
                </div>
            </form>
        )
    }
}

ManageCourseDangerZone = connect()(ManageCourseDangerZone)

export default ManageCourseDangerZone