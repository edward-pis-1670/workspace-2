import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'

class CourseInstructor extends React.Component {

    render() {
        let textcost;
        if (this.props.course.cost && this.props.course.cost != 0) {
            textcost = ('$' + this.props.course.cost)
        } else {
            textcost = 'Free'
        }
        return (
            <div className="col-sm-6">
                <Link to={'/managecourse/' + this.props.course._id + '/goals'} className="course-instructor">
                    <img className="course-instructor-image" src={'/api/resource/images?src=' + this.props.course.coverphoto + '&w=130&h=73'} />
                    <div className="course-instructor-detail">
                        <h4 className='course-name'><strong>{this.props.course.name}</strong></h4>
                        <h5 className="text-success">{this.props.username}</h5>
                        <div>
                            <span className="course-rate">
                                <span style={{ width: (this.props.course.star || 0) * 20 + '%' }}></span>
                            </span>
                            <span>
                                {' ' + (this.props.course.star || 0).toFixed(1) + '(' + this.props.course.numberofreviews + ')'}
                            </span>
                        </div>
                        <h5 style={{ color: 'black', fontWeight: 'bold' }}>{this.props.course.numberofstudent + ' enrolled'}</h5>
                        <h5 style={{ color: 'black', fontWeight: 'bold' }}>{'Total revenue: ' + this.props.course.revenue + '$'}</h5>
                        <h4 className='text-danger'><strong>{(this.props.course.public ? 'Public' : 'Draft') + ': '}</strong>{textcost}</h4>
                    </div>
                </Link>
            </div>
        )
    }
}
export default CourseInstructor