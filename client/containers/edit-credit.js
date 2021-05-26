import React, { Component } from 'react'
import { Header, Image, Table, Icon, Button, Form, Radio, Input } from 'semantic-ui-react'
import { setUser, setGetMyCourses, depositFunds, withDraw, setPaypalId } from '../actions'
import { Pager, Glyphicon, Modal } from 'react-bootstrap'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class ModalDepositFunds extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            money: 100
        }
    }
    handleOpen(e) {
        this.setState({
            modalOpen: true,
            money: 100
        })
    }
    handleClose(e) {
        this.setState({
            modalOpen: false,
            money: 100
        })
    }
    handleChange(e, { value }) {
        this.setState({
            money: parseInt(value)
        })
    }
    depositFunds(e) {
        $.post('/api/user/deposit-funds', {
            money: this.state.money
        }, (data, status) => {
            if (data.code == 200) {
                this.props.depositFunds(this.state.money)
                this.handleClose(e)
            } else if (data.code == 1001) {
                this.props.dispatch(setUser({}))
                this.props.dispatch(setGetMyCourses(false))
                browserHistory.push('/courses')
            }
        })
    }
    render() {
        return <Modal bsSize="small" show={this.state.modalOpen}
            onHide={this.handleClose.bind(this)}>
            <Modal.Header closeButton>
                <Modal.Title className="text-center h3">Deposit Funds</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflow: 'auto' }}>
                <Form>
                    <Form.Field>
                        <Radio
                            label='100$'
                            name='radioGroup'
                            value='100'
                            checked={this.state.money === 100}
                            onChange={this.handleChange.bind(this)}
                            />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='200$'
                            name='radioGroup'
                            value='200'
                            checked={this.state.money === 200}
                            onChange={this.handleChange.bind(this)}
                            />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='500$'
                            name='radioGroup'
                            value='500'
                            checked={this.state.money === 500}
                            onChange={this.handleChange.bind(this)}
                            />
                    </Form.Field>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button positive onClick={e => this.depositFunds(e)}>Confirm ${this.state.money}USD</Button>
            </Modal.Footer>
        </Modal>
    }
}

class ModalWithDraw extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            money: 100,
            message: ''
        }
    }

    handleOpen(e) {
        this.setState({
            modalOpen: true,
            money: 100
        })
    }
    handleClose(e) {
        this.setState({
            modalOpen: false,
            money: 100
        })
    }
    handleChange(e, { value }) {
        this.setState({
            money: parseInt(value)
        })
    }
    withDraw(e) {
        $.post('/api/user/withdraw', {
            money: this.state.money
        }, (data, status) => {
            if (data.code == 200) {
                this.props.withDraw(this.state.money)
                this.handleClose(e)
            } else if (data.code == 1001) {
                this.props.dispatch(setUser({}))
                this.props.dispatch(setGetMyCourses(false))
                browserHistory.push('/courses')
            } else {
                this.setState({ message: data.message })
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
        return <Modal bsSize="small" show={this.state.modalOpen}
            onHide={this.handleClose.bind(this)}>
            <Modal.Header closeButton>
                <Modal.Title className="text-center h3">Withdraw Money</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflow: 'auto' }}>
                <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                <Form>
                    <Form.Field>
                        <Radio
                            label='100$'
                            name='radioGroup'
                            value='100'
                            checked={this.state.money === 100}
                            onChange={this.handleChange.bind(this)}
                            />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='200$'
                            name='radioGroup'
                            value='200'
                            checked={this.state.money === 200}
                            onChange={this.handleChange.bind(this)}
                            />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='500$'
                            name='radioGroup'
                            value='500'
                            checked={this.state.money === 500}
                            onChange={this.handleChange.bind(this)}
                            />
                    </Form.Field>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button negative onClick={e => this.withDraw(e)}>Confirm ${this.state.money}USD</Button>
            </Modal.Footer>
        </Modal>
    }
}

class EditCredit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            filter: {
                page: 1,
                sort: 0
            },
            paypalid: this.props.paypalid,
            payments: []
        }
    }
    handlePayPalId(e) {
        this.setState({ paypalid: e.target.value })
    }
    depositFunds(money) {
        this.props.dispatch(depositFunds(money))
        $.post('/api/user/get-payment',
            this.state.filter, (data, status) => {
                if (data.code == 200) {
                    this.setState({ payments: data.payments })
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
    }
    withDraw(money) {
        this.props.dispatch(withDraw(money))
        $.post('/api/user/get-payment',
            this.state.filter, (data, status) => {
                if (data.code == 200) {
                    this.setState({ payments: data.payments })
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
    }
    showModalDepositFunds(e) {
        this.modalDepositFunds.handleOpen(e)
    }
    showModalWithDraw(e) {
        this.modalWithDraw.handleOpen(e)
    }
    componentDidMount() {
        $.post('/api/user/get-payment',
            this.state.filter, (data, status) => {
                if (data.code == 200) {
                    this.setState({ payments: data.payments })
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
    }
    onClickPrev(e) {
        e.preventDefault()
        let filter = this.state.filter
        filter.page = Math.max(1, filter.page - 1)
        this.setState({ filter: filter })
        $.post('/api/user/get-payment',
            filter, (data, status) => {
                if (data.code == 200) {
                    this.setState({ payments: data.payments })
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
    }
    onClickNext(e) {
        e.preventDefault()
        let filter = this.state.filter
        filter.page = filter.page + 1
        this.setState({ filter: filter })
        $.post('/api/user/get-payment',
            filter, (data, status) => {
                if (data.code == 200) {
                    this.setState({ payments: data.payments })
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
    }
    deletePayment(e, payment, index) {
        let payments = this.state.payments
        payments = [...payments.slice(0, index), ...payments.slice(index + 1)]
        this.setState({ payments: payments })
        $.post('/api/user/delete-payment', { _id: payment._id })
    }
    setPaypalId(e) {
        $.post('/api/user/set-paypalid', {
            paypalid: this.state.paypalid
        }, (data, status) => {
            if (data.code == 200) {
                this.props.dispatch(setPaypalId(this.state.paypalid))
            } else if (data.code == 1001) {
                this.props.dispatch(setUser({}))
                this.props.dispatch(setGetMyCourses(false))
                browserHistory.push('/courses')
            }
        })
    }
    render() {
        return <div>
            <link rel="stylesheet" href="/stylesheets/semantic.min.css" />
            <div className="edit-user-header-box">
                <p className="text-center"><strong>Credit</strong></p>
                <p className="text-center">Your credit information</p>
            </div>
            <div className="edit-user-content">
                <h4 style={{ fontWeight: 'bold', display: 'inline' }}>Your total Academy credits: USD${this.props.balance.toFixed(2)} </h4>
                <Button.Group size="mini">
                    <Button positive onClick={e => this.showModalDepositFunds(e)}>Deposit Funds</Button>
                    <Button.Or />
                    <Button negative onClick={e => this.showModalWithDraw(e)}>Withdraw Money</Button>
                </Button.Group>
                <h4 style={{ fontWeight: 'bold' }}>Enter PayPal-Id(It is your e-mail address you used to register with PayPal)</h4>
                <Input fluid action value={this.state.paypalid} onChange={e => this.handlePayPalId(e)}
                    placeholder='Your e-mail address you used to register with PayPal' type='email' >
                    <input />
                    <Button disabled={this.props.paypalid == this.state.paypalid} positive onClick={e => this.setPaypalId(e)}>Save</Button>
                </Input>
                <h4 style={{ fontWeight: 'bold' }}>Credit History</h4>
                <Table basic='very' celled collapsing>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Credit History</Table.HeaderCell>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Information</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.payments.map((payment, index) => {
                            return <Table.Row key={index}>
                                <Table.Cell>{['Withdraw Money', 'Deposit Funds', 'Enroll in a course', 'Student enroll in your course'][payment.type]}</Table.Cell>
                                <Table.Cell>{new Date(payment.createdAt).toLocaleString()}</Table.Cell>
                                <Table.Cell>{payment.money.toFixed(2) + '$'}</Table.Cell>
                                <Table.Cell>{(payment.type == 2 || payment.type == 3) ?
                                    <div>
                                        <div>
                                            <strong style={{ color: '#5bc0de' }}>Course: </strong>
                                            <Link to={payment.type == 2 ? ('/course/' + payment.information.course._id) : ('/managecourse/' + payment.information.course._id + '/goals')}>
                                                {payment.information.course.name}</Link>
                                        </div>
                                        <div>
                                            <strong style={{ color: '#5bc0de' }}>{payment.type == 2 ? 'Instructor: ' : 'Student: '}</strong>
                                            <Link to={'/view-user/' + payment.information.user._id}>{payment.information.user.username}</Link>
                                        </div>
                                    </div> : ''
                                }</Table.Cell>
                                <Table.Cell textAlign='center'>
                                    <Button positive onClick={e => this.deletePayment(e, payment, index)}><Glyphicon glyph='trash' /></Button>
                                </Table.Cell>
                            </Table.Row>
                        })}
                    </Table.Body>
                </Table>
                <ModalDepositFunds depositFunds={this.depositFunds.bind(this)} ref={ref => this.modalDepositFunds = ref} />
                <ModalWithDraw withDraw={this.withDraw.bind(this)} ref={ref => this.modalWithDraw = ref} />
                <Pager>
                    <Pager.Item disabled={this.state.filter.page == 1}
                        previous onClick={(e) => { this.onClickPrev(e) } }>&larr; Previous Page</Pager.Item>
                    <Pager.Item next onClick={(e) => { this.onClickNext(e) } }>Next Page &rarr;</Pager.Item>
                </Pager>
            </div>
        </div>
    }
}

EditCredit = connect((state) => {
    return {
        balance: state.user.creditbalance,
        paypalid: state.user.paypalid || ''
    }
})(EditCredit)

export default EditCredit