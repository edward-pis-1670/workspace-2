import React from 'react'
import ReactDOM from 'react-dom'
import CourseInstructor from '../components/course-instructor'
import { Modal, Breadcrumb, Glyphicon, Row, Pager, Pagination } from 'react-bootstrap'
import { setUser, createCourse, getAllMyCourses, setGetMyCourses } from '../actions'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
var _ = require('lodash')

class ModalCreateCourse extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false,
            coursename: '',
            message: '',
            isSubmitting: false
        }
    }
    hideModal() {
        this.setState({ showModal: false, coursename: '' })
    }
    handleCourseName(e) {
        this.setState({ coursename: e.target.value })
    }

    render() {
        return <Modal show={this.state.showModal}
            onHide={this.hideModal.bind(this)}>
            <Modal.Header closeButton>
                <Modal.Title className="text-center h3">CREATE COURSE</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflow: 'auto' }}>
                <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                <form className="form-horizontal" onSubmit={this.props.onSubmitCreateCourse.bind(this)}>
                    <div className="form-group form-group-lg">
                        <div className="input-group col-sm-offset-1 col-sm-10">
                            <span className="input-group-addon glyphicon glyphicon-book"></span>
                            <input type="text" required className="form-control"
                                placeholder="Course's name" onChange={this.handleCourseName.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-1 col-sm-10">
                            <button disabled={this.state.isSubmitting} type="submit" className="btn btn-warning btn-lg center-block">
                                <span className='glyphicon glyphicon-ok'>{' '}Create</span>
                            </button>
                        </div>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    }
}

class Instructor extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            coursename: this.props.location.query.name || '',
            headerColor: ['lightseagreen', 'teal', 'forestgreen', 'green', 'sienna', 'peru', 'indigo'][Math.floor(Math.random() * 7)],
        }
    }
    componentDidMount() {
        if (!this.props.getMyCourses)
            // $.get('/api/user/get-all-mycourses', (courses) => {
                $.get('http://localhost:5000/users/get-all-my-courses', (courses) => {
                this.props.dispatch(getAllMyCourses(JSON.parse(courses)))
                this.props.dispatch(setGetMyCourses(true))
            })
    }
    showModal() {
        this.refs.modalCreateCourse.setState({ showModal: true })
    }
    onSubmitCreateCourse(e) {
        e.preventDefault()
        this.refs.modalCreateCourse.setState({ isSubmitting: true })
        $.post(
            // 'api/user/createcourse',
            'http://localhost:5000/users/create-course',
            { coursename: this.refs.modalCreateCourse.state.coursename },
            (data, status) => {
                if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    this.props.dispatch(setGetMyCourses(false))
                    return browserHistory.push('/')
                }
                if (data.code == 200) {
                    this.props.dispatch(createCourse(data.course))
                    return this.refs.modalCreateCourse.setState({ isSubmitting: false, coursename: '', showModal: false })
                }
                let alertlogin = $(".alert:first")
                alertlogin.show(500, function () {
                    setTimeout(function () {
                        alertlogin.hide(500)
                    }, 3000)
                })
                this.refs.modalCreateCourse.setState({ message: data.message, isSubmitting: false })
            }
        )
    }

    onSelectPage(page) {
        let query = this.props.location.query
        let url = '/instructor' + '?page=' + page
            + (query.name ? ('&name=' + query.name) : '') + (query.free ? ('&free=' + query.free) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
            + (query.level ? ('&level=' + query.level) : '')
        browserHistory.push(url)
    }
    // onClickPrev(e) {
    //     e.preventDefault()
    //     let query = this.props.location.query
    //     if (!query.page || query.page <= 1) {
    //         return
    //     }
    //     let url = '/instructor' + '?page=' + (query.page - 1)
    //         + (query.name ? ('&name=' + query.name) : '') + (query.free ? ('&free=' + query.free) : '')
    //         + (query.sort ? ('&sort=' + query.sort) : '')
    //         + (query.level ? ('&level=' + query.level) : '')
    //     browserHistory.push(url)
    // }
    // onClickNext(e) {
    //     e.preventDefault()
    //     let query = this.props.location.query
    //     if (!query.page) {
    //         query.page = 1
    //     }
    //     let url = '/instructor' + '?page=' + (parseInt(query.page) + 1)
    //         + (query.name ? ('&name=' + query.name) : '') + (query.free ? ('&free=' + query.free) : '')
    //         + (query.sort ? ('&sort=' + query.sort) : '')
    //         + (query.level ? ('&level=' + query.level) : '')
    //     browserHistory.push(url)
    // }
    onChangeFilterSort(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/instructor' + '?page=' + query.page
            + (query.name ? ('&name=' + query.name) : '') + (query.free ? ('&free=' + query.free) : '')
            + '&sort=' + e.target.value
            + (query.level ? ('&level=' + query.level) : '')
        browserHistory.push(url)
    }
    onChangeFilterPrice(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/instructor' + '?page=' + query.page
            + (e.target.value == 'none' ? '' : ('&free=' + e.target.value))
            + (query.name ? ('&name=' + query.name) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
            + (query.level ? ('&level=' + query.level) : '')
        browserHistory.push(url)
    }
    onChangeFilterLevel(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/instructor' + '?page=' + query.page
            + (query.free ? ('&free=' + query.free) : '')
            + (query.name ? ('&name=' + query.name) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
            + (e.target.value == 'none' ? '' : ('&level=' + e.target.value))
        browserHistory.push(url)
    }
    onChangeCourseName(e) {
        e.preventDefault()
        this.setState({ coursename: e.target.value })
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/instructor' + '?page=' + query.page
            + (e.target.value == '' ? '' : ('&name=' + e.target.value)) + (query.free ? ('&free=' + query.free) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
            + (query.level ? ('&level=' + query.level) : '')
        browserHistory.push(url)
    }

    render() {
        if (!this.props.mycourses) return <div></div>
        let page = this.props.location.query.page || 1
        let sort = this.props.location.query.sort || 1
        let name = this.props.location.query.name
        let free = this.props.location.query.free
        let level = this.props.location.query.level
        let mycourses = this.props.mycourses
        if (name) {
            mycourses = _.filter(mycourses, (o) => {
                return o.name.match(new RegExp('.*' + name + '.*', 'i'))
            })
        }
        if (free) {
            mycourses = _.filter(mycourses, (o) => {
                return free == 'true' ? (!o.cost || o.cost == 0) : (o.cost && o.cost > 0)
            })
        }
        if (level) {
            mycourses = _.filter(mycourses, (o) => {
                return o.level && o.level == level
            })
        }
        switch (parseInt(sort)) {
            case 1:
                mycourses = _.sortBy(mycourses, 'numberofstudent').reverse()
                break
            case 2:
                mycourses = _.sortBy(mycourses, 'revenue').reverse()
                break
            case 3:
                mycourses = _.sortBy(mycourses, 'star').reverse()
                break
        }
        let maxPage = parseInt((mycourses.length - 1) / 8) + 1
        mycourses = mycourses.slice(8 * page - 8, 8 * page)
        let listCourses = mycourses.map((course, index) => {
            return <CourseInstructor key={index} username={this.props.username} course={course} />
        })
        let averageRating = 0
        let numberCourse = this.props.mycourses.length
        for (var i = 0; i < this.props.mycourses.length; i++) {
            if (!this.props.mycourses[i].star || this.props.mycourses[i].star == 0) {
                numberCourse--
            } else {
                averageRating += this.props.mycourses[i].star
            }
        }
        averageRating = numberCourse == 0 ? 0 : averageRating / numberCourse
        return (
            <div>
                <div className='genre-info-box' style={{ backgroundColor: this.state.headerColor }} >
                    <div className='container'>
                        <Breadcrumb>
                            <Breadcrumb.Item onClick={(e) => { e.preventDefault(); browserHistory.push('/courses'); } }>
                                <Glyphicon glyph="home" />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item active>Instructor</Breadcrumb.Item>
                        </Breadcrumb>
                        <Row>
                            <p className='genre-title col-xs-8'>Instructor Dashboard</p>
                            <div className="col-xs-4">
                                <button onClick={this.showModal.bind(this)} className="btn btn-warning btn-lg">
                                    <span className='glyphicon glyphicon-pencil'></span>{' '}Create Course
                            </button>
                            </div>
                        </Row>
                        <ul className="mycourses-navbar">
                            <li><Link to='/mycourses/learning'>Learning</Link></li>
                            <li><Link to='/mycourses/wishlist'>Wishlist</Link></li>
                            <li><Link activeClassName="active"
                                onlyActiveOnIndex={true} to='/instructor'>My Courses</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="instructor-infor-box">
                    <div className="container">
                        <div className="col-sm-4">
                            <h5>Total Revenue</h5>
                            <h4 className='text-success'>{this.props.mycourses.map(o => o.revenue ? o.revenue : 0).reduce((a, b) => a + b, 0)}<span className='glyphicon glyphicon-usd'></span></h4>
                        </div>
                        <div className="col-sm-4">
                            <h5>Average Rating</h5>
                            <h4 className='text-success'>{averageRating.toFixed(2)} <span className='glyphicon glyphicon-star'></span></h4>
                        </div>
                        <div className="col-sm-4">
                            <h5>Total Students</h5>
                            <h4 className='text-success'>{this.props.mycourses.map(o => o.numberofstudent ? o.numberofstudent : 0).reduce((a, b) => a + b, 0)} <span className='glyphicon glyphicon-education'></span></h4>
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <form className='form-inline' style={{ marginBottom: '20px' }} onSubmit={(e) => { this.onSubmitFormSearch(e) } }>
                        <div className="form-group form-group-lg">
                            <select style={{ fontWeight: 'bold' }} className="form-control"
                                value={this.props.location.query.level || 'none'} onChange={(e) => { this.onChangeFilterLevel(e) } } >
                                <option value='none' style={{ fontWeight: 'bold' }}>--Select Level--</option>
                                <option value='1' style={{ fontWeight: 'bold' }}>Beginner Level</option>
                                <option value='2' style={{ fontWeight: 'bold' }}>Intermediate Level</option>
                                <option value='3' style={{ fontWeight: 'bold' }}>Expert Level</option>
                                <option value='0' style={{ fontWeight: 'bold' }}>All Levels</option>
                            </select>
                        </div>{' '}
                        <div className="form-group form-group-lg" >
                            <select style={{ fontWeight: 'bold' }} className="form-control"
                                value={this.props.location.query.free || 'none'} onChange={(e) => { this.onChangeFilterPrice(e) } }>
                                <option value='none' style={{ fontWeight: 'bold' }}>--Price--</option>
                                <option value='false' style={{ fontWeight: 'bold' }}>Paid</option>
                                <option value='true' style={{ fontWeight: 'bold' }}>Free</option>
                            </select>
                        </div>{' '}
                        <div className="form-group form-group-lg">
                            <label>Sort by:</label>{' '}
                            <select style={{ fontWeight: 'bold' }} className="form-control"
                                value={this.props.location.query.sort || '1'} onChange={(e) => { this.onChangeFilterSort(e) } } >
                                <option value='1' style={{ fontWeight: 'bold' }}>Popularity</option>
                                <option value='2' style={{ fontWeight: 'bold' }}>Best Seller</option>
                                <option value='3' style={{ fontWeight: 'bold' }}>Highest Rated</option>
                            </select>
                        </div>{' '}
                        <div className="form-group form-group-lg" style={{ fontWeight: 'bold' }}>
                            <div className="input-group input-group-lg">
                                <input type="text" className="form-control"
                                    value={this.state.coursename} placeholder="Search" onChange={(e) => { this.onChangeCourseName(e) } } />
                                <span className="input-group-btn">
                                    <button className="btn btn-info" disabled><Glyphicon glyph='search' /></button>
                                </span>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="container">
                    <Row>
                        {listCourses}
                    </Row>
                    <div className='text-center'>
                        <Pagination prev next first last ellipsis boundaryLinks
                            items={maxPage}
                            maxButtons={5} activePage={parseInt(this.props.location.query.page || 1)}
                            onSelect={(page) => { this.onSelectPage(page) } } />
                    </div>
                </div>
                <ModalCreateCourse ref="modalCreateCourse" onSubmitCreateCourse={this.onSubmitCreateCourse.bind(this)} />
            </div>
        )
    }
}

Instructor = connect((state) => {
    return {
        mycourses: state.user.mycourses,
        getMyCourses: state.getMyCourses,
        username: state.user.username,
    }
})(Instructor)

export default Instructor