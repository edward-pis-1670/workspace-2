import React from 'react'
import { connect } from 'react-redux';
import { setUser } from '../actions'
import { browserHistory } from 'react-router'

class EditAccount extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            password: '',
            newPassword: '',
            message: '',
            isSubmitting: false
        }
    }
    handlePassword(e) {
        this.setState({ password: e.target.value })
    }
    handleNewPassword(e) {
        this.setState({ newPassword: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault()

        this.setState({ isSubmitting: true })
        $.post(
            '/api/user/edit-account',
            {
                password: this.state.password,
                newPassword: this.state.newPassword
            },
            (data, status) => {
                if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    return browserHistory.push('/')
                }
                let alertlogin = $(".alert:first")
                alertlogin.show(500, function () {
                    setTimeout(function () {
                        alertlogin.hide(500)
                    }, 3000)
                })
                this.setState({ message: data.message, isSubmitting: false, password: '', newPassword: '' })
            }
        )
    }

    render() {
        let form
        if (this.props.email != '') {
            form = <form role="form" className="col-lg-offset-1 col-lg-9" onSubmit={this.onSubmit.bind(this)}>
                <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                <div className="form-group">
                    <label>Email :</label>
                    <div className="input-group">
                        <span className="input-group-addon glyphicon glyphicon-envelope"></span>
                        <input className="form-control" placeholder="Email"
                            value={this.props.email} readOnly={true} />
                    </div>
                </div>
                <hr />
                <div className="form-group">
                    <label>Change Password: </label>

                    <div className="input-group">
                        <span className="input-group-addon glyphicon glyphicon-lock"></span>
                        <input type="password" className="form-control" placeholder="Password"
                            value={this.state.password} onChange={this.handlePassword.bind(this)} />
                    </div>
                </div>
                <div className="form-group">
                    <div className="input-group">
                        <span className="input-group-addon glyphicon glyphicon-lock"></span>
                        <input type="password" className="form-control" placeholder="New Password"
                            value={this.state.newPassword} onChange={this.handleNewPassword.bind(this)} required />
                    </div>
                </div>
                <button disabled={this.state.isSubmitting} type="submit" className="btn btn-success center-block">
                    <span className="glyphicon glyphicon-ok"></span>{' '}Change Password
                </button>
            </form>
        } else {
            form = <form role="form" className="col-lg-offset-1 col-lg-9">
                <div className="form-group">
                    <label>Facebook :</label>
                    <input className="form-control" placeholder="Email"
                        value={'https://www.facebook.com/' + this.props.facebookid}
                        readOnly={true} />
                </div>
                <hr />
            </form >
        }
        return (

            <div>
                <div className="edit-user-header-box">
                    <p className="text-center"><strong>Account</strong></p>
                    <p className="text-center">Edit your account settings and change your password here.</p>
                </div>
                <div className="edit-user-content">
                    {form}
                </div>
            </div>
        )
    }
}


EditAccount = connect((state) => {
    return {
        email: state.user.email || '',
        facebookid: state.user.facebookid || ''
    }
})(EditAccount)


export default EditAccount