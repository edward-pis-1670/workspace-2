import React from 'react'
import { Modal } from 'react-bootstrap'
import { setUser, showModal } from '../actions'
import { connect } from 'react-redux';
import { forgotPassword } from '../apis/auth'

class FormForgotPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            message: '',
            isSubmitting: false
        }
    }
    handleEmail(e) {
        this.setState({ email: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault()
        this.setState({ isSubmitting: true })
        forgotPassword({
            email: this.state.email
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
    onHide() {
        this.props.dispatch(showModal(0))
    }
    onClickLogin() {
        this.props.dispatch(showModal(1))
    }
    render() {
        return (
            <Modal show={this.props.hasOwnProperty('showModalId') && this.props.showModalId == 3}
                onHide={this.onHide.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center h3">FORGOT PASSWORD</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: 'auto' }}>
                    <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                    <form className="form-horizontal" onSubmit={(e) => { this.onSubmit(e) }}>
                        <div className="form-group form-group-lg">
                            <div className="input-group col-sm-offset-1 col-sm-10">
                                <span className="input-group-addon glyphicon glyphicon-envelope"></span>
                                <input type="email" required className="form-control" placeholder="Email" name="email" onChange={(e) => { this.handleEmail(e) }} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-1 col-sm-10">
                                <button type="submit" disabled={this.state.isSubmitting}
                                    className="btn btn-success btn-lg btn-block">
                                    <span className="glyphicon glyphicon-ok"></span>{' '}Reset Password{' '}
                                </button>
                                <h5 className="text-center">or{' '}
                                    <strong><a onClick={this.onClickLogin.bind(this)}>
                                        <span className="glyphicon glyphicon-log-in"></span>{' '}Login</a></strong>
                                </h5>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return { showModalId: state.showModalId }
}
export default connect(mapStateToProps)(FormForgotPassword)