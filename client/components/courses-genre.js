import React from 'react'
import PanelCourses from './panel-courses'
import { Breadcrumb, Glyphicon, ProgressBar } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router'
import { getCoursesByGenre } from '../apis/courses'

class CoursesGenre extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            genre: { name: '', _id: '' },
            listCourses: [],
            progress: 0,
            bsStyle: ['success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 4)],
            headerColor: ['lightseagreen', 'teal', 'forestgreen', 'green', 'sienna', 'peru', 'indigo'][Math.floor(Math.random() * 7)]
        }
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.params.genreid != nextProps.params.genreid) {
            this.setState({
                progress: 0,
                listCourses: [],
                headerColor: ['lightseagreen', 'teal', 'forestgreen', 'green', 'sienna', 'peru', 'indigo'][Math.floor(Math.random() * 7)],
                bsStyle: ['success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 4)],
            })
            getCoursesByGenre({
                genreid: nextProps.params.genreid,
                success: (data, status) => {
                    if (data.code == 200) {
                        setTimeout(() => {
                            this.setState({ genre: data.genre, listCourses: data.listCourses })
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
                },
            })
        }
    }
    componentDidMount() {
        getCoursesByGenre({
            genreid: this.props.params.genreid,
            success: (data, status) => {
                if (data.code == 200) {
                    setTimeout(() => {
                        this.setState({ genre: data.genre, listCourses: data.listCourses })
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
            },
        })
    }

    render() {
        return <div>
            <div className='genre-info-box' style={{ backgroundColor: this.state.headerColor }} >
                <Breadcrumb>
                    <Breadcrumb.Item onClick={(e) => { e.preventDefault(); browserHistory.push('/courses'); }}>
                        <Glyphicon glyph="home" />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        {this.state.genre.name || ''}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <span className='genre-title'>{this.state.genre.name || ''}</span>
            </div>
            {this.state.listCourses.length == 0 ?
                <ProgressBar bsStyle={this.state.bsStyle} active now={this.state.progress} /> :
                this.state.listCourses.map((category, index) => {
                    if (!category.courses || category.courses.length == 0)
                        return
                    return <PanelCourses key={index} courses={category.courses} title={category.name} id={this.state.genre._id || ''} subid={category._id} />
                })}
        </div>
    }
}

export default CoursesGenre