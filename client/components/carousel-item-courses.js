import React from 'react';
import { Col } from 'react-bootstrap'
import Course from './course'

class CarouselItemCourses extends React.Component {
    render() {
        return <div>
            {this.props.courses.map((course, index) => {
                return <Col md={3} sm={6} xs={12} key={index}>
                    <Course popoverPlacement={index%2==0?'right':'left'} course={course} />
                </Col>
            })}
        </div>
    }
}

export default CarouselItemCourses
