import React from 'react'
import { connect } from 'react-redux'
import { setUser, setGetMyCourses } from '../actions'
import { browserHistory } from 'react-router'

class EditDangerzone extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            password: '',
            message: '',
            isSubmitting: false
        }
    }

    onSubmit(e) {
        e.preventDefault()
        this.setState({ isSubmitting: true })
        $.post(
            '/api/user/delete',
            this.props.email == '' ? { facebookid: this.props.facebookid } : { password: this.state.password },
            (data, status) => {
                if (data.code == 1001 || data.code == 200) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    return browserHistory.push('/')
                }
                let alertlogin = $(".alert:first")
                alertlogin.show(500, function () {
                    setTimeout(function () {
                        alertlogin.hide(500)
                    }, 3000)
                })
                this.setState({ message: data.message, isSubmitting: false, password: '' })
            }
        )
    }

    handlePassword(e) {
        this.setState({ password: e.target.value })
    }

    render() {
        let form
        if (this.props.email != '') {
            form = <form role="form" className="col-lg-offset-1 col-lg-9" onSubmit={this.onSubmit.bind(this)}>
                <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon glyphicon glyphicon-lock"></span>
                        <input type="password" className="form-control" placeholder="Password"
                            value={this.state.password} onChange={this.handlePassword.bind(this)} required />
                    </div>
                </div>
                <button disabled={this.state.isSubmitting} type="submit" className="btn btn-danger center-block">
                    <span className="glyphicon glyphicon-trash"></span>{' '}
                    Delete</button>
            </form>
        } else {
            form = <form role="form" className="col-lg-offset-1 col-lg-9" onSubmit={this.onSubmit.bind(this)}>
                <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                <button disabled={this.state.isSubmitting} type="submit" className="btn btn-danger center-block">
                    <span className="glyphicon glyphicon-trash"></span>{' '}Delete</button>
            </form>
        }
        return (
            <div>
                <div className="edit-user-header-box">
                    <p className="text-center"><strong>Danger Zone</strong></p>
                    <p className="text-center">Delete your account permanently.</p>
                </div>
                <div className="edit-user-content">
                    <h3>Delete Your Account</h3>
                    <div className="h5">
                        <strong className="text-danger">Warning: </strong>
                        If you delete your account, you will be unsubscribed from all your courses, and will lose access forever.
                    </div>
                    <hr />
                    {form}
                </div>
            </div>
        )
    }
}

EditDangerzone = connect((state) => {
    return {
        email: state.user.email || '',
        facebookid: state.user.facebookid || ''
    }
})(EditDangerzone)

export default EditDangerzone