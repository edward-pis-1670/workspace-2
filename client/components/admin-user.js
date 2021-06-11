import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router'
import { Breadcrumb, Glyphicon, Pager } from 'react-bootstrap'
import { Header, Image, Table, Icon, Button, Modal } from 'semantic-ui-react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { setUser, setGetMyCourses } from '../actions'

class ModalAddUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            email: '',
            creditbalance: 0,
            role: 0,
            youtube: '',
            twitter: '',
            linkedin: '',
            website: '',
            modalOpen: false
        }
    }
    handleOpen(e) {
        this.setState({
            modalOpen: true,
        })
    }

    handleClose(e) {
        this.setState({
            modalOpen: false,
        })
    }
    onSubmit(e) {
        e.preventDefault()
    }
    handleUsername(e) {
        this.setState({ username: e.target.value })
    }
    handlePassword(e) {
        this.setState({ password: e.target.value })
    }
    handleEmail(e) {
        this.setState({ email: e.target.value })
    }
    handleYoutube(e) {
        this.setState({ youtube: e.target.value })
    }
    handleLinkedin(e) {
        this.setState({ linkedin: e.target.value })
    }
    handleTwitter(e) {
        this.setState({ twitter: e.target.value })
    }
    handleWebsite(e) {
        this.setState({ website: e.target.value })
    }
    handleCredit(e) {
        this.setState({ creditbalance: e.target.value })
    }
    handleRole(e) {
        this.setState({ role: e.target.value })
    }
    Process() {
        // $.post('/api/admin/add-user',
        $.post('http://localhost:5000/admin/add-new-user-by-admin',
            this.state, (data, status) => {
                if (data.code == 200) {
                    this.setState({ modalOpen: false })
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
    }
    render() {
        return <Modal trigger={<Button onClick={this.handleOpen.bind(this)} positive size='large' type='button'>Add New User</Button>}
            open={this.state.modalOpen}
            onClose={this.handleClose.bind(this)}>
            <Modal.Header>ADD NEW USER</Modal.Header>
            <Modal.Content image>
                <form role="form" onSubmit={this.onSubmit.bind(this)}>
                    <div className="form-group">
                        <label>Username: </label>
                        <div className="input-group">
                            <span className="input-group-addon glyphicon glyphicon-user"></span>
                            <input type="text" name='username' required className="form-control" placeholder="Username"
                                value={this.state.username} onChange={e => this.handleUsername(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <div className="input-group">
                            <Glyphicon glyph='envelope' className="input-group-addon" />
                            <input type="email" name='email' required className="form-control" placeholder="Email"
                                value={this.state.email} onChange={e => this.handleEmail(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <div className="input-group">
                            <Glyphicon glyph='lock' className="input-group-addon" />
                            <input type="password" name='password' required className="form-control" placeholder="Password"
                                value={this.state.password} onChange={e => this.handlePassword(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Link: </label>
                        <div className="input-group">
                            <span className="input-group-addon glyphicon glyphicon-globe"></span>
                            <input type="url" className="form-control" placeholder="Website (http(s)://..)"
                                value={this.state.website} onChange={e => this.handleWebsite(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-addon fa fa-twitter" style={{ display: 'table-cell' }}></span>
                            <span className="input-group-addon">http://twitter.com/</span>
                            <input type="text" className="form-control" placeholder="Twitter Profile"
                                value={this.state.twitter} onChange={e => this.handleTwitter(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-addon fa fa-linkedin" style={{ display: 'table-cell' }}></span>
                            <span className="input-group-addon">http://www.linkedin.com/</span>
                            <input type="text" className="form-control" placeholder="Linkedin Profile"
                                value={this.state.linkedin} onChange={e => this.handleLinkedin(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-addon fa fa-youtube" style={{ display: 'table-cell' }}></span>
                            <span className="input-group-addon">http://www.youtube.com/</span>
                            <input type="text" className="form-control" placeholder="Youtube Profile"
                                value={this.state.youtube} onChange={e => this.handleYoutube(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Credit Balance: </label>
                        <div className="input-group">
                            <Glyphicon glyph='usd' className="input-group-addon" />
                            <input type="number" className="form-control" placeholder="Username"
                                value={this.state.creditbalance} onChange={e => this.handleCredit(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Role: </label>
                        <div className="input-group">
                            <Glyphicon glyph='fire' className="input-group-addon" />
                            <select className="form-control" value={this.state.role} onChange={e => this.handleRole(e)}>
                                <option value='0'>User</option>
                                <option value='1'>Admin</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Modal.Content>
            <Modal.Actions>
                <Button primary onClick={e => this.Process(e)}>
                    Proceed <Icon name='right chevron' />
                </Button>
            </Modal.Actions>
        </Modal>
    }
}
class ModalEditUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            user: {}
        }
    }
    handleClose(e) {
        this.setState({ modalOpen: false })
    }
    handleOpen(e, user) {
        this.setState({ modalOpen: true, user: user })
    }
    onSubmit(e) {
        e.preventDefault()
    }
    handleUsername(e) {
        let user = this.state.user
        user.username = e.target.value
        this.setState({ user: user })
    }
    handleEmail(e) {
        let user = this.state.user
        user.email = e.target.value
        this.setState({ user: user })
    }
    handleYoutube(e) {
        let user = this.state.user
        user.youtube = e.target.value
        this.setState({ user: user })
    }
    handleLinkedin(e) {
        let user = this.state.user
        user.linkedin = e.target.value
        this.setState({ user: user })
    }
    handleTwitter(e) {
        let user = this.state.user
        user.twitter = e.target.value
        this.setState({ user: user })
    }
    handleWebsite(e) {
        let user = this.state.user
        user.website = e.target.value
        this.setState({ user: user })
    }
    handleCredit(e) {
        let user = this.state.user
        user.creditbalance = e.target.value
        this.setState({ user: user })
    }
    handleRole(e) {
        let user = this.state.user
        user.role = e.target.value
        this.setState({ user: user })
    }
    Process() {
        // $.post('/api/admin/edit-user',
        $.post('http://localhost:5000/admin/edit-user',
            this.state.user, (data, status) => {
                if (data.code == 200) {
                    this.setState({ modalOpen: false })
                    this.props.onEditSuccess(null)
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
    }

    render() {
        return <Modal open={this.state.modalOpen}
            onClose={this.handleClose.bind(this)}>
            <Modal.Header>{this.state.user.username}</Modal.Header>
            <Modal.Content image>
                <form role="form" onSubmit={e => this.onSubmit(e)}>
                    <div className="form-group">
                        <label>Username: </label>
                        <div className="input-group">
                            <span className="input-group-addon glyphicon glyphicon-user"></span>
                            <input type="text" name='username' required className="form-control" placeholder="Username"
                                value={this.state.user.username || ''} onChange={e => this.handleUsername(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Email: </label>
                        <div className="input-group">
                            <Glyphicon glyph='envelope' className="input-group-addon" />
                            <input type="email" name='email' required className="form-control" placeholder="Email"
                                value={this.state.user.email || ''} onChange={e => this.handleEmail(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Link: </label>
                        <div className="input-group">
                            <span className="input-group-addon glyphicon glyphicon-globe"></span>
                            <input type="url" className="form-control" placeholder="Website (http(s)://..)"
                                value={this.state.user.website || ''} onChange={e => this.handleWebsite(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-addon fa fa-twitter" style={{ display: 'table-cell' }}></span>
                            <span className="input-group-addon">http://twitter.com/</span>
                            <input type="text" className="form-control" placeholder="Twitter Profile"
                                value={this.state.user.twitter || ''} onChange={e => this.handleTwitter(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-addon fa fa-linkedin" style={{ display: 'table-cell' }}></span>
                            <span className="input-group-addon">http://www.linkedin.com/</span>
                            <input type="text" className="form-control" placeholder="Linkedin Profile"
                                value={this.state.user.linkedin || ''} onChange={e => this.handleLinkedin(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group">
                            <span className="input-group-addon fa fa-youtube" style={{ display: 'table-cell' }}></span>
                            <span className="input-group-addon">http://www.youtube.com/</span>
                            <input type="text" className="form-control" placeholder="Youtube Profile"
                                value={this.state.user.youtube || ''} onChange={e => this.handleYoutube(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Credit Balance: </label>
                        <div className="input-group">
                            <Glyphicon glyph='usd' className="input-group-addon" />
                            <input type="number" className="form-control" placeholder="Username"
                                value={this.state.user.creditbalance || 0} onChange={e => this.handleCredit(e)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Role: </label>
                        <div className="input-group">
                            <Glyphicon glyph='fire' className="input-group-addon" />
                            <select className="form-control" value={this.state.user.role || 0} onChange={e => this.handleRole(e)}>
                                <option value='0'>User</option>
                                <option value='1'>Admin</option>
                            </select>
                        </div>
                    </div>
                </form>
            </Modal.Content>
            <Modal.Actions>
                <Button primary onClick={e => this.Process(e)}>
                    Save <Icon name='right chevron' />
                </Button>
            </Modal.Actions>
        </Modal>
    }
}

class AdminUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchQuery: '',
            users: []
        }
    }
    componentDidMount() {
        this.setState({ searchQuery: this.props.location.query.searchQuery || '' })
        // $.post('/api/admin/get-users',
        $.post('http://localhost:5000/admin/get-users',
            this.props.location.query, (data, status) => {
                if (data.code == 200) {
                    this.setState({ users: data.users })
                } else if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    browserHistory.push('/courses')
                }
            })
    }
    
    componentWillReceiveProps(nextProps) {
        if (this.props.location.query != nextProps.location.query) {
            this.setState({
                searchQuery: nextProps.location.query.searchQuery || ''
            })
            // $.post('/api/admin/get-users',
            $.post('http://localhost:5000/admin/get-users',

                nextProps.location.query, (data, status) => {
                    if (data.code == 200) {
                        this.setState({ users: data.users })
                    } else if (data.code == 1001) {
                        this.props.dispatch(setUser({}))
                        this.props.dispatch(setGetMyCourses(false))
                        browserHistory.push('/courses')
                    }
                })
        }
    }
    onClickPrev(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page || query.page <= 1) {
            return
        }
        let url = '/admin/users' + '?page=' + (query.page - 1)
            + (query.searchQuery ? ('&searchQuery=' + query.searchQuery) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
        browserHistory.push(url)
    }
    onClickNext(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/admin/users' + '?page=' + (parseInt(query.page) + 1)
            + (query.searchQuery ? ('&searchQuery=' + query.searchQuery) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
        browserHistory.push(url)
    }
    onChangeFilterSort(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/admin/users' + '?page=' + query.page
            + (query.searchQuery ? ('&searchQuery=' + query.searchQuery) : '')
            + '&sort=' + e.target.value
        browserHistory.push(url)
    }
    onSubmitFormSearch(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/admin/users' + '?page=' + query.page
            + (this.state.searchQuery != '' ? ('&searchQuery=' + this.state.searchQuery) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
        browserHistory.push(url)
    }
    handleSearchQuery(e) {
        this.setState({ searchQuery: e.target.value })
        if (e.target.value == '') {
            let query = this.props.location.query
            if (!query.page) {
                query.page = 1
            }
            let url = '/admin/users' + '?page=' + query.page
                + (query.sort ? ('&sort=' + query.sort) : '')
            browserHistory.push(url)
        }
    }
    deleteUser(_id) {
        // $.post('/api/admin/delete-user',
        $.post('http://localhost:5000/admin/delete-user',
            { _id: _id }, (data, status) => {
                if (data.code == 200) {
                    let users = this.state.users
                    let index = _.findIndex(users, o => o._id == _id)
                    this.setState({ users: [...users.slice(0, index), ...users.slice(index + 1)] })
                } else if (data.code == 1001) {
                    browserHistory.push('/courses')
                }
            })
    }
    editUser(e, user) {
        this.modalEditUser.handleOpen(e, user)
    }
    onEditSuccess(e) {
        let users = this.state.users
        let user = this.modalEditUser.state.user
        let index = _.findIndex(users, o => o._id == user._id)
        this.setState({ users: [...users.slice(0, index), user, ...users.slice(index + 1)] })
    }
    render() {
        return <div>
            <form className='form-inline' style={{ marginBottom: '20px' }} onSubmit={(e) => { this.onSubmitFormSearch(e) } }>
                <div className="form-group form-group-lg">
                    <label className='control-label'>Sort by:</label>{' '}
                    <select style={{ fontWeight: 'bold' }} className="form-control"
                        value={this.props.location.query.sort || '1'} onChange={(e) => { this.onChangeFilterSort(e) } } >
                        <option value='1' style={{ fontWeight: 'bold' }}>Name: A-to-Z</option>
                        <option value='2' style={{ fontWeight: 'bold' }}>Name: Z-to-A</option>
                    </select>
                </div>{' '}
                <div className="form-group form-group-lg">
                    <div className="input-group input-group-lg">
                        <input type="text" className="form-control"
                            value={this.state.searchQuery} placeholder="Search name or email"
                            onChange={(e) => { this.handleSearchQuery(e) } } />
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="submit"><Glyphicon glyph='search' /></button>
                        </span>
                    </div>
                </div>{' '}
                <div className="form-group form-group-lg">
                    <ModalAddUser />
                </div>
            </form>
            <Table basic='very' celled collapsing>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>User</Table.HeaderCell>
                        <Table.HeaderCell>Email</Table.HeaderCell>
                        <Table.HeaderCell>Facebook</Table.HeaderCell>
                        <Table.HeaderCell>Links</Table.HeaderCell>
                        <Table.HeaderCell>Credit Balance</Table.HeaderCell>
                        <Table.HeaderCell>Admin</Table.HeaderCell>
                        <Table.HeaderCell>Actived</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.state.users.map((user, index) => {
                        return <Table.Row key={index}>
                            <Table.Cell>
                                <Header as='h4' image>
                                    <Image src={user.photo} shape='rounded' size='mini' />
                                    <Header.Content>{user.username}</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell>
                                {user.email ? <a target="_blank" href={'mailto:' + user.email}>{user.email + ''}</a> : ''}
                            </Table.Cell>
                            <Table.Cell>
                                {user.facebookid ? <a target="_blank" href={'https://www.facebook.com/' + user.facebookid}>{user.username}</a> : ''}
                            </Table.Cell>
                            <Table.Cell>
                                {user.website ?
                                    <div>
                                        <strong>Website: <a target='_blank' href={user.website}>{user.website}</a></strong>
                                        <br />
                                    </div> : ''}
                                {user.twitter ?
                                    <div>
                                        <strong>Twitter: <a target='_blank' href={'http://twitter.com/' + user.twitter}>{'http://twitter.com/' + user.twitter}</a></strong>
                                        <br />
                                    </div> : ''}
                                {user.linkedin ?
                                    <div>
                                        <strong>Linkedin: <a target='_blank' href={'http://www.linkedin.com/' + user.linkedin}>{'http://www.linkedin.com/' + user.linkedin}</a></strong>
                                        <br />
                                    </div> : ''}
                                {user.youtube ?
                                    <div>
                                        <strong>Youtube: <a target='_blank' href={'http://www.youtube.com/' + user.youtube}>{'http://www.youtube.com/' + user.youtube}</a></strong>
                                        <br />
                                    </div> : ''}
                            </Table.Cell>
                            <Table.Cell>{user.creditbalance + ''}</Table.Cell>
                            <Table.Cell textAlign='center'>
                                {user.role == 1 ? <Icon color='green' name='checkmark' size='large' /> : ''}
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                {user.verified ? <Icon color='green' name='checkmark' size='large' /> : ''}
                            </Table.Cell>
                            <Table.Cell textAlign='center'>
                                <Button.Group size='mini'>
                                    <Button positive onClick={e => this.editUser(e, user)}><Glyphicon glyph='pencil' /></Button>
                                    <Button.Or />
                                    <Button negative onClick={(e) => { this.deleteUser(user._id) } }><Glyphicon glyph='trash' /></Button>
                                </Button.Group>
                            </Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table>
            <ModalEditUser ref={ref => this.modalEditUser = ref} onEditSuccess={e => this.onEditSuccess(e)} />
            <Pager>
                <Pager.Item disabled={!this.props.location.query.page || this.props.location.query.page == 1}
                    previous onClick={(e) => { this.onClickPrev(e) } }>&larr; Previous Page</Pager.Item>
                <Pager.Item next onClick={(e) => { this.onClickNext(e) } }>Next Page &rarr;</Pager.Item>
            </Pager>
        </div>
    }
}
AdminUser = connect()(AdminUser)

export default AdminUser
