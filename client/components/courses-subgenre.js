import React from 'react'
import PanelCourses from './panel-courses'
import { Breadcrumb, Glyphicon, Col, ProgressBar, Pager, Row, FormGroup, ControlLabel, FormControl } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router'
import Course from './course'
import { getCoursesBySubGenre } from '../apis/courses'


class CoursesSubgenre extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            genre: { name: '', _id: '' },
            subgenre: { name: '', _id: '' },
            courses: [],
            progress: 0,
            bsStyle: ['success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 4)],
            headerColor: ['lightseagreen', 'teal', 'forestgreen', 'green', 'sienna', 'peru', 'indigo'][Math.floor(Math.random() * 7)],
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.params != nextProps.params || this.props.location.query != nextProps.location.query) {
            this.setState({
                progress: 0,
                courses: [],
                headerColor: ['lightseagreen', 'teal', 'forestgreen', 'green', 'sienna', 'peru', 'indigo'][Math.floor(Math.random() * 7)],
                bsStyle: ['success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 4)],
            })
            getCoursesBySubGenre({
                subgenreid: nextProps.params.subgenreid,
                data: nextProps.location.query,
                success: (data, status) => {
                    if (data.code == 200) {
                        setTimeout(() => {
                            this.setState({
                                genre: data.genre,
                                subgenre: data.subgenre,
                                courses: data.courses
                            })
                        }, 500)
                    }
                },
                xhr: () => {
                    let xhr = new window.XMLHttpRequest()
                    xhr.onprogress = (evt) => {
                        if (evt.lengthComputable) {
                            let percentComplete = Math.ceil(evt.loaded * 100.0 / evt.total)
                            this.setState({ progress: percentComplete })
                        }
                    }
                    return xhr
                }
            })
        }
    }
    componentDidMount() {
        getCoursesBySubGenre({
            subgenreid: this.props.params.subgenreid,
            data: this.props.location.query,
            success: (data, status) => {
                if (data.code == 200) {
                    setTimeout(() => {
                        this.setState({
                            genre: data.genre,
                            subgenre: data.subgenre,
                            courses: data.courses
                        })
                    }, 500)
                }
            },
            xhr: () => {
                let xhr = new window.XMLHttpRequest()
                xhr.onprogress = (evt) => {
                    if (evt.lengthComputable) {
                        let percentComplete = Math.ceil(evt.loaded * 100.0 / evt.total)
                        this.setState({ progress: percentComplete })
                    }
                }
                return xhr
            }
        })
    }
    onClickPrev(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page || query.page <= 1) {
            return
        }
        let url = '/courses/' + this.props.params.genreid + '/' + this.props.params.subgenreid + '?page=' + (query.page - 1)
            + (query.level ? ('&level=' + query.level) : '') + (query.free ? ('&free=' + query.free) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
        browserHistory.push(url)
    }
    onClickNext(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/courses/' + this.props.params.genreid + '/' + this.props.params.subgenreid + '?page=' + (parseInt(query.page) + 1)
            + (query.level ? ('&level=' + query.level) : '') + (query.free ? ('&free=' + query.free) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
        browserHistory.push(url)
    }
    onChangeFilterPrice(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/courses/' + this.props.params.genreid + '/' + this.props.params.subgenreid + '?page=' + query.page
            + (query.level ? ('&level=' + query.level) : '') + (e.target.value == 'none' ? '' : ('&free=' + e.target.value))
            + (query.sort ? ('&sort=' + query.sort) : '')
        browserHistory.push(url)
    }
    onChangeFilterLevel(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/courses/' + this.props.params.genreid + '/' + this.props.params.subgenreid + '?page=' + query.page
            + (e.target.value == 'none' ? '' : ('&level=' + e.target.value)) + (query.free ? ('&free=' + query.free) : '')
            + (query.sort ? ('&sort=' + query.sort) : '')
        browserHistory.push(url)
    }
    onChangeFilterSort(e) {
        e.preventDefault()
        let query = this.props.location.query
        if (!query.page) {
            query.page = 1
        }
        let url = '/courses/' + this.props.params.genreid + '/' + this.props.params.subgenreid + '?page=' + query.page
            + (query.level ? ('&level=' + query.level) : '') + (query.free ? ('&free=' + query.free) : '')
            + '&sort=' + e.target.value
        browserHistory.push(url)
    }

    render() {
        return <div>
            <div className='genre-info-box' style={{ backgroundColor: this.state.headerColor }} >
                <Breadcrumb>
                    <Breadcrumb.Item onClick={(e) => { e.preventDefault(); browserHistory.push('/courses'); }}>
                        <Glyphicon glyph="home" />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item onClick={(e) => { e.preventDefault(); browserHistory.push('/courses/' + (this.state.genre._id || '')); }}>
                        {this.state.genre.name || ''}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        {this.state.subgenre.name || ''}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <span className='genre-title'>{this.state.subgenre.name || ''}</span>
            </div>
            {this.state.courses.length == 0 ?
                <ProgressBar bsStyle={this.state.bsStyle} active now={this.state.progress} /> :
                <div>
                    <div className='form-inline' style={{ marginBottom: '20px' }}>
                        <div className="form-group">
                            <select style={{ fontWeight: 'bold' }} className="form-control"
                                value={this.props.location.query.level || 'none'} onChange={(e) => { this.onChangeFilterLevel(e) }} >
                                <option value='none' style={{ fontWeight: 'bold' }}>--Select Level--</option>
                                <option value='1' style={{ fontWeight: 'bold' }}>Beginner Level</option>
                                <option value='2' style={{ fontWeight: 'bold' }}>Intermediate Level</option>
                                <option value='3' style={{ fontWeight: 'bold' }}>Expert Level</option>
                                <option value='0' style={{ fontWeight: 'bold' }}>All Levels</option>
                            </select>
                        </div>{' '}
                        <div className="form-group" >
                            <select style={{ fontWeight: 'bold' }} className="form-control"
                                value={this.props.location.query.free || 'none'} onChange={(e) => { this.onChangeFilterPrice(e) }}>
                                <option value='none' style={{ fontWeight: 'bold' }}>--Price--</option>
                                <option value='false' style={{ fontWeight: 'bold' }}>Paid</option>
                                <option value='true' style={{ fontWeight: 'bold' }}>Free</option>
                            </select>
                        </div>{' '}
                        <div className="form-group">
                            <label>Sort by:</label>{' '}
                            <select style={{ fontWeight: 'bold' }} className="form-control"
                                value={this.props.location.query.sort || '1'} onChange={(e) => { this.onChangeFilterSort(e) }} >
                                <option value='1' style={{ fontWeight: 'bold' }}>Popularity</option>
                                <option value='2' style={{ fontWeight: 'bold' }}>Highest Rated</option>
                                <option value='3' style={{ fontWeight: 'bold' }}>Newest</option>
                                <option value='4' style={{ fontWeight: 'bold' }}>Price: Low to high</option>
                                <option value='5' style={{ fontWeight: 'bold' }}>Price: High to low</option>
                            </select>
                        </div>
                    </div>
                    <Row>{this.state.courses.map((course, index) => {
                        return <Col md={3} sm={6} xs={12} key={index}>
                            <Course popoverPlacement={index % 2 == 0 ? 'right' : 'left'} course={course} />
                        </Col>
                    })}
                    </Row>
                    <Pager>
                        <Pager.Item disabled={!this.props.location.query.page || this.props.location.query.page == 1}
                            previous onClick={(e) => { this.onClickPrev(e) }}>&larr; Previous Page</Pager.Item>
                        <Pager.Item next onClick={(e) => { this.onClickNext(e) }}>Next Page &rarr;</Pager.Item>
                    </Pager>
                </div>
            }
        </div>
    }
}

export default CoursesSubgenre