import React from 'react';
import { Carousel, Button, Glyphicon } from 'react-bootstrap'
import CarouselItemCourses from './carousel-item-courses'
import { browserHistory } from 'react-router'

class PanelCourses extends React.Component {

    onClickNext() {
        let activeIndex = this.refs.carousel.state.activeIndex
        this.refs.carousel.setState({ activeIndex: activeIndex + 1, direction: 'next' })
    }

    render() {
        let listCarouselItem = []
        for (let i = 0; i < this.props.courses.length / 4; i++) {
            listCarouselItem[i] = <Carousel.Item key={i}>
                <CarouselItemCourses
                    courses={(i < this.props.courses.length - 1) ? this.props.courses.slice(4 * i, 4 * i + 4) : this.props.courses.slice(4 * i)} />
            </Carousel.Item>
        }
        return <div className={'panel panel-' + ['primary', 'danger', 'info'][Math.floor((Math.random() * 3))]}>
            <div className="panel-heading">
                <strong>{this.props.title}</strong>
                <Button onClick={() => { browserHistory.push('/courses/' + this.props.id + (this.props.subid ? ('/' + this.props.subid) : '')) } } style={{ marginLeft: '20px' }}>
                    <strong>View More{' '}<Glyphicon glyph="share-alt" /></strong>
                </Button>
            </div>
            <div className="panel-body" style={{width: '100%', display: 'inline-block', backgroundColor: 'mediumseagreen' }}>
                <Carousel ref='carousel' indicators={false} interval={15000}>
                    {listCarouselItem}
                </Carousel>
            </div>
        </div>
    }
}

export default PanelCourses