import React from 'react'
import { Breadcrumb, Glyphicon, Row, Col, Pagination } from 'react-bootstrap'
import { Link, browserHistory } from 'react-router'
import Course from './course'

class ViewUser extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user: {},
            page: 1,
            bsStyle: ['success', 'info', 'warning', 'danger'][Math.floor(Math.random() * 4)],
            headerColor: ['lightseagreen', 'teal', 'forestgreen', 'green', 'sienna', 'peru', 'indigo'][Math.floor(Math.random() * 7)]
        }
    }
    componentDidMount() {
        $.post('/api/user/view-user',
            {
                id: Number(this.props.params.id)
            }, (data, status) => {
                if (data.code == 200)
                    this.setState({ user: data.user })
            })
    }
    render() {
        if (!this.state.user._id)
            return <div></div>
        let courses = this.state.user.mycourses.slice(8 * this.state.page - 8, 8 * this.state.page)
        return <div>
            <div className='genre-info-box' style={{ backgroundColor: this.state.headerColor }} >
                <div className='container'>
                    <Breadcrumb>
                        <Breadcrumb.Item onClick={(e) => { e.preventDefault(); browserHistory.push('/courses'); } }>
                            <Glyphicon glyph="home" />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>{this.state.user.username}</Breadcrumb.Item>
                    </Breadcrumb>
                    <span className='genre-title'>{this.state.user.username}</span>
                </div>
            </div>
            <div className='container'>
                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h1 className="panel-title">Instructor Biography</h1>
                    </div>
                    <div className="panel-body">
                        <div className='row'>
                            <div className='col-xs-2 col-md-1' style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                                <div className="photo-profile" style={{ backgroundImage: 'url(' + (this.state.user.photo) + ')' }}></div>
                            </div>
                            <div className='col-xs-10 col-md-11' >
                                <Link to={'/view-user/' + this.state.user._id} className='lecturer-name'>{this.state.user.username}</Link>
                                <br className='hidden-xs' />
                                {this.state.user.twitter ? <a target='_blank' href={'https://twitter.com/' + this.state.user.twitter}>
                                    <img className='icon-social' src='/images/Twitter-icon.png'></img>
                                </a> : ''}
                                {this.state.user.youtube ? <a target='_blank' href={'https://www.youtube.com/' + this.state.user.youtube}>
                                    <img className='icon-social' src='/images/YouTube-icon.png'></img>
                                </a> : ''}
                                {this.state.user.linkedin ? <a target='_blank' href={'https://www.linkedin.com/' + this.state.user.linkedin}>
                                    <img className='icon-social' src='/images/linkedin-icon.png'></img>
                                </a> : ''}
                                {this.state.user.website ? <a target='_blank' href={this.state.user.website}>
                                    <img className='icon-social' src='/images/browser-icon.png'></img>
                                </a> : ''}
                                {this.state.user.googleid ? <a target='_blank' href={'https://plus.google.com/' + this.state.user.googleid}>
                                    <img className='icon-social' src='/images/google-plus-icon.png'></img>
                                </a> : ''}
                                {this.state.user.facebookid ? <a target='_blank' href={'https://facebook.com/' + this.state.user.facebookid}>
                                    <img className='icon-social' src='/images/facebook-icon.png'></img>
                                </a> : ''}
                            </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.user.biography }} style={{ fontSize: '16px', marginTop: '10px' }} />

                    </div>
                </div>
                <h2>Courses taught by
                    <span style={{ fontStyle: 'italic', color: 'green' }}>{' "' + this.state.user.username + '"'}</span>
                </h2>
                <Row>{courses.map((course, index) => {
                    return <Col md={3} xs={6} key={index}>
                        <Course popoverPlacement={index%2==0?'right':'left'} course={course} />
                    </Col>
                })}
                </Row>
                <div className='text-center'>
                    <Pagination prev next first last ellipsis boundaryLinks
                        items={parseInt((this.state.user.mycourses.length - 1) / 8) + 1}
                        maxButtons={5} activePage={this.state.page}
                        onSelect={(page) => { this.setState({ page: page }) } } />
                </div>
            </div>
        </div>
    }
}

export default ViewUser