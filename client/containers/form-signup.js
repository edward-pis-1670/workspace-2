import React from 'react'
import { Modal } from 'react-bootstrap'
import { setUser, showModal } from '../actions'
import { connect } from 'react-redux';
import { browserHistory } from 'react-router'
import { signup } from '../apis/auth'

class FormSignup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
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
    handleUsername(e) {
        this.setState({ username: e.target.value })
    }
    onEnter() {
        this.setState({ username: '', email: '', password: '' })
    }
    onHide() {
        this.props.dispatch(showModal(0))
    }
    onClickLogin() {
        this.props.dispatch(showModal(1))
    }
    onSubmit(e) {
        e.preventDefault()
        this.setState({ isSubmitting: true })
        signup({
            username: this.state.username,
            email: this.state.email,
            password: this.state.password
        }, (data, status) => {
            this.setState({ message: data.message, isSubmitting: false })
            let alertlogin = $(".alert:first")
            alertlogin.show(500, function () {
                setTimeout(function () {
                    alertlogin.hide(500)
                }, 10000)
            })
        })
    }
    render() {
        return (
            <Modal show={this.props.hasOwnProperty('showModalId') && this.props.showModalId == 2}
                onHide={this.onHide.bind(this)} onEnter={this.onEnter.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center h3">Sign up and start learning!</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: 'auto' }}>
                    <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                    <form className="form-horizontal" onSubmit={this.onSubmit.bind(this)}>
                        <div className="form-group form-group-lg">
                            <div className="input-group col-sm-offset-1 col-sm-10">
                                <span className="input-group-addon glyphicon glyphicon-user"></span>
                                <input type="text" maxLength="20" minLength="6" required className="form-control"
                                    placeholder="Username" onChange={this.handleUsername.bind(this)} name='username' />
                            </div>
                        </div>
                        <div className="form-group form-group-lg">
                            <div className="input-group col-sm-offset-1 col-sm-10">
                                <span className="input-group-addon glyphicon glyphicon-envelope"></span>
                                <input type="email" required className="form-control" placeholder="Email"
                                    onChange={this.handleEmail.bind(this)} name='email' />
                            </div>
                        </div>
                        <div className="form-group form-group-lg">
                            <div className="input-group col-sm-offset-1 col-sm-10">
                                <span className="input-group-addon glyphicon glyphicon-lock"></span>
                                <input type="password" maxLength="20" minLength="6" required className="form-control"
                                    placeholder="Password" onChange={this.handlePassword.bind(this)} name='password' />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-1 col-sm-10">
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" /> Be the first one to know about new courses and great offers!
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-1 col-sm-10">
                                <button type='submit' disabled={this.state.isSubmitting} className="btn btn-success btn-block btn-lg" >
                                    <span className="glyphicon glyphicon-ok"></span>{' '}Sign up
                                </button>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <h5 className="text-center">
                        Already have an account?{' '}<strong><a onClick={this.onClickLogin.bind(this)}>{' '}
                            <span className="glyphicon glyphicon-log-in"></span>{' '}Login</a></strong>
                    </h5>
                </Modal.Footer>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return { showModalId: state.showModalId }
}
export default connect(mapStateToProps)(FormSignup)