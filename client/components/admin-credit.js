import React, { Component } from 'react'
import { Header, Image, Table, Icon, Button, Form, Radio, Input } from 'semantic-ui-react'
import { setUser, setGetMyCourses, depositFunds, withDraw, setPaypalId } from '../actions'
import { Pager, Glyphicon, Modal } from 'react-bootstrap'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class AdminCredit extends Component {

    constructor(props) {
        super(props)
        this.state = {
            filter: {
                page: 1,
                sort: 0
            },
            cardnumber: '',
            cardnumberTemp: '',
            profitratio: 0,
            profitratioTemp: 0,
            totalprofit: 0,
            payments: []
        }
    }
    handleCardNumber(e) {
        this.setState({ cardnumberTemp: e.target.value })
    }
    handleProfitRatio(e) {
        this.setState({ profitratioTemp: e.target.value })
    }
    componentDidMount() {
        $.post('/api/admin/get-payment',
            this.state.filter, (data, status) => {
                if (data.code == 200) {
                    this.setState({ payments: data.payments })
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
        $.get('/api/admin/get-config', (data, status) => {
            if (data.code == 200) {
                this.setState({
                    cardnumber: data.cardnumber,
                    cardnumberTemp: data.cardnumber,
                    profitratio: data.profitratio,
                    profitratioTemp: data.profitratio,
                    totalprofit: data.totalprofit
                })
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
        $.post('/api/admin/get-payment',
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
        $.post('/api/admin/get-payment',
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
        $.post('/api/admin/delete-payment', { _id: payment._id })
    }
    setCardNumber(e) {
        $.post('/api/admin/set-cardnumber', {
            cardnumber: this.state.cardnumberTemp
        }, (data, status) => {
            if (data.code == 200) {
                this.setState({ cardnumber: data.cardnumber })
            } else if (data.code == 1001) {
                this.props.dispatch(setUser({}))
                this.props.dispatch(setGetMyCourses(false))
                browserHistory.push('/courses')
            }
        })
    }
    setProfitRatio(e) {
        $.post('/api/admin/set-profitratio', {
            profitratio: this.state.profitratioTemp
        }, (data, status) => {
            if (data.code == 200) {
                this.setState({ profitratio: data.profitratio })
            } else if (data.code == 1001) {
                this.props.dispatch(setUser({}))
                this.props.dispatch(setGetMyCourses(false))
                browserHistory.push('/courses')
            }
        })
    }
    render() {
        return <div>
            <h4 style={{ fontWeight: 'bold', display: 'inline' }}>Total Profit: USD${this.state.totalprofit.toFixed(2)} </h4>

            <h4 style={{ fontWeight: 'bold' }}>Enter Credit Card Number(It is your visa card number you used to linked with PayPal)</h4>
            <Input fluid action value={this.state.cardnumberTemp} onChange={e => this.handleCardNumber(e)}
                placeholder='Card Number' type='text' >
                <input />
                <Button disabled={this.state.cardnumber == this.state.cardnumberTemp} positive onClick={e => this.setCardNumber(e)}>Save</Button>
            </Input>
            <h4 style={{ fontWeight: 'bold' }}>Profit Ratio</h4>
            <Input fluid action value={this.state.profitratioTemp} onChange={e => this.handleProfitRatio(e)}
                placeholder='Profit Ratio' type='Number' step="0.01" >
                <input />
                <Button disabled={this.state.profitratio == this.state.profitratioTemp} positive onClick={e => this.setProfitRatio(e)}>Save</Button>
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
                            <Table.Cell>{['Withdraw Money', 'Deposit Funds', 'Student enroll in a course'][payment.type]}</Table.Cell>
                            <Table.Cell>{new Date(payment.createdAt).toLocaleString()}</Table.Cell>
                            <Table.Cell>{payment.money + '$'}</Table.Cell>
                            <Table.Cell>{payment.type == 2 ?
                                <div>
                                    <div>
                                        <strong style={{ color: '#5bc0de' }}>Student: </strong>
                                        <Link to={'/view-user/' + payment.user._id}>
                                            {payment.user.username}</Link>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#5bc0de' }}>Course: </strong>
                                        <Link to={'/course/' + payment.information.course._id}>
                                            {payment.information.course.name}</Link>
                                    </div>
                                    <div>
                                        <strong style={{ color: '#5bc0de' }}>Instructor: </strong>
                                        <Link to={'/view-user/' + payment.information.user._id}>
                                            {payment.information.user.username}</Link>
                                    </div>
                                </div> : <div>
                                    <div>
                                        <strong style={{ color: '#5bc0de' }}>User: </strong>
                                        <Link to={'/view-user/' + payment.user._id}>
                                            {payment.user.username}</Link>
                                    </div>
                                </div>
                            }</Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Button positive onClick={e => this.deletePayment(e, payment, index)}><Glyphicon glyph='trash' /></Button>
                            </Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table>
            <Pager>
                <Pager.Item disabled={this.state.filter.page == 1}
                    previous onClick={(e) => { this.onClickPrev(e) } }>&larr; Previous Page</Pager.Item>
                <Pager.Item next onClick={(e) => { this.onClickNext(e) } }>Next Page &rarr;</Pager.Item>
            </Pager>
        </div>
    }
}

export default AdminCredit