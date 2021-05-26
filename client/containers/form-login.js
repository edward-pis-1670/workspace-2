import React from 'react'
import { Modal } from 'react-bootstrap'
import { setUser, showModal } from '../actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { login } from '../apis/auth'

class FormLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            isSubmitting: false,
            message: '',
        }
    }
    handleEmail(e) {
        this.setState({ email: e.target.value })
    }
    handlePassword(e) {
        this.setState({ password: e.target.value })
    }
    onEnter() {
        this.setState({ email: '', password: '' })
    }
    onHide() {
        this.props.dispatch(showModal(0))
    }
    onClickSignup() {
        this.props.dispatch(showModal(2))
    }
    onClickForgotPassword() {
        this.props.dispatch(showModal(3))
    }
    onSubmit(e) {
        e.preventDefault()
        this.setState({ isSubmitting: true })
        login({
            email: this.state.email,
            password: this.state.password
        }, (data, status) => {
            if (data.code == 200) {
                this.props.dispatch(showModal(0))
                this.props.dispatch(setUser(data.user))
                browserHistory.push('/courses')
            } else {
                this.setState({ message: data.message, isSubmitting: false })
                let alertlogin = $(".alert:first")
                alertlogin.show(500, function () {
                    setTimeout(function () {
                        alertlogin.hide(500)
                    }, 3000)
                })
            }
        })
    }
    render() {
        return (
            <Modal bsSize="large" show={this.props.hasOwnProperty('showModalId') && this.props.showModalId == 1}
                onHide={this.onHide.bind(this)} onEnter={this.onEnter.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center h3">Login to your Academy account!</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: 'auto' }}>
                    <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <h4 className="text-center">Login with social accounts</h4>
                        <div className="form-group">
                            <a href="/authentication/auth/facebook" className="btn btn-block btn-social btn-lg btn-facebook">
                                <i className="fa fa-facebook"></i>Log in with Facebook</a>
                        </div>
                        <div className="form-group">
                            <a href="/authentication/auth/google" className="btn btn-block btn-social btn-lg btn-google">
                                <i className="fa fa-google"></i>Log in with Google+</a>
                        </div>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">

                        <h4 className="text-center">Login with your email</h4>
                        <form className="form-horizontal" onSubmit={this.onSubmit.bind(this)}>
                            <div className="form-group form-group-lg">
                                <div className="input-group col-sm-offset-1 col-sm-10">
                                    <span className="input-group-addon glyphicon glyphicon-envelope"></span>
                                    <input type="email" required className="form-control" placeholder="Email" name='email'
                                        onChange={this.handleEmail.bind(this)} disabled={this.state.isSubmitting} />
                                </div>
                            </div>
                            <div className="form-group form-group-lg">
                                <div className="input-group col-sm-offset-1 col-sm-10">
                                    <span className="input-group-addon glyphicon glyphicon-lock"></span>
                                    <input type="password" maxLength="20" minLength="6" required className="form-control"
                                        placeholder="Password" name='password' onChange={this.handlePassword.bind(this)}
                                        disabled={this.state.isSubmitting} />
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="col-sm-offset-1 col-sm-10">
                                    <button type="submit" disabled={this.state.isSubmitting}
                                        className="btn btn-success btn-lg btn-block">
                                        <span className='glyphicon glyphicon-ok'></span>{' '}Login
                                    </button>
                                    <h5 className="text-center">or
                                    <strong><a onClick={this.onClickForgotPassword.bind(this)}> Forgot Password</a></strong>
                                    </h5>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <h5 className="text-center">
                        Don't have an account?
                        <strong><a onClick={this.onClickSignup.bind(this)} title="">{' '}
                            <span className="glyphicon glyphicon-registration-mark"></span>{' '}Sign up</a></strong>
                    </h5>
                </Modal.Footer>
            </Modal>
        )
    }
}
function mapStateToProps(state) {
    return { showModalId: state.showModalId }
}

export default connect(mapStateToProps)(FormLogin)