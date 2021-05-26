import React from 'react'
import ReactDOM from 'react-dom'

import { connect } from 'react-redux'
import { Modal, Button, Row, Col, Glyphicon } from 'react-bootstrap'
import { addReview } from '../apis/courses'
class Review extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            content: '',
            star: 5,
            starTemp: 5
        }
    }
    onHide() {
        this.setState({ show: false })
    }
    onSubmit(e) {
        e.preventDefault()
        addReview({
            courseid: this.props.course._id,
            content: this.state.content,
            star: this.state.star
        }, (data, status) => {
            if (data.code == 404)
                return this.setState({ show: false })
            if (data.code == 200) {
                this.setState({ show: false, content: '' })
                this.props.onSubmitReviewSuccess()
            }
        })
    }
    onChange(e) {
        this.setState({ content: e.target.value })
    }
    onHover(star) {
        this.setState({ starTemp: star })
    }
    onMouseOut() {
        this.setState({ starTemp: this.state.star })
    }
    onClick(star) {
        this.setState({ starTemp: star, star: star })
    }
    render() {
        return <Modal show={this.state.show} onHide={this.onHide.bind(this)}>
            <Modal.Header closeButton>
                <div className='img-review'><img src={'/api/resource/images?src=' + this.props.user.photo + '&w=50&h=50'} /></div>
                <div className='title-review'>Review by {this.props.user.username}</div>
            </Modal.Header>
            <form onSubmit={(e) => { this.onSubmit(e) }}>
                <Modal.Body style={{ overflow: 'auto' }}>
                    <textarea className="form-control" rows="5"
                        placeholder="Tell others what you think about this course. Would you recommend it, and why?"
                        value={this.state.content} onChange={(e) => { this.onChange(e) }}></textarea>
                    <div onMouseOut={() => { this.onMouseOut() }}>
                        <Button onMouseOver={() => { this.onHover(1) }} onClick={() => { this.onClick(1) }}
                            className='btn-rate' >
                            <Glyphicon glyph={this.state.starTemp >= 1 ? 'star' : 'star-empty'} />
                        </Button>
                        <Button onMouseOver={() => { this.onHover(2) }} onClick={() => { this.onClick(2) }}
                            className='btn-rate' >
                            <Glyphicon glyph={this.state.starTemp >= 2 ? 'star' : 'star-empty'} />
                        </Button>
                        <Button onMouseOver={() => { this.onHover(3) }} onClick={() => { this.onClick(3) }}
                            className='btn-rate' >
                            <Glyphicon glyph={this.state.starTemp >= 3 ? 'star' : 'star-empty'} />
                        </Button>
                        <Button onMouseOver={() => { this.onHover(4) }} onClick={() => { this.onClick(4) }}
                            className='btn-rate' >
                            <Glyphicon glyph={this.state.starTemp >= 4 ? 'star' : 'star-empty'} />
                        </Button>
                        <Button onMouseOver={() => { this.onHover(5) }} onClick={() => { this.onClick(5) }}
                            className='btn-rate' >
                            <Glyphicon glyph={this.state.starTemp >= 5 ? 'star' : 'star-empty'} />
                        </Button>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" type='submit'>Submit</Button>
                </Modal.Footer>
            </form>
        </Modal>
    }
}

export default Review