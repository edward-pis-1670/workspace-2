import React from 'react'
import { browserHistory } from 'react-router'

class Background extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            idimg: 0,
            coursename: ''
        }
        this.changebg = this.changebg.bind(this)
    }

    changebg() {
        this.changebgCallback = setTimeout(() => {
            this.setState({ idimg: (this.state.idimg + 1) % 2 })
            this.changebg()
        }, 10000)
    }
    componentDidMount() {
        this.changebg()
    }
    componentWillUnmount() {
        clearTimeout(this.changebgCallback);
    }
    onSubmitSearch(e) {
        e.preventDefault()
        browserHistory.push('/courses/search?name=' + this.state.coursename)
        this.setState({ coursename: '' })
    }
    handleCourseName(e) {
        this.setState({ coursename: e.target.value })
    }

    render() {
        var divStyle = {
            backgroundImage: 'url(' + this.props.imgs[this.state.idimg] + ')'
        }
        return (
            <div className="home-bg-form" style={divStyle}>
                <form onSubmit={this.onSubmitSearch.bind(this)} className="home-form">
                    <div className="form-group has-success">
                        <label className="control-label h3">Own your future by learning new skills online</label>
                        <label className="control-label h4">Take the world's best courses, online.</label>
                        <div className="input-group input-group-lg">
                            <input value={this.state.coursename}
                                onChange={this.handleCourseName.bind(this)}
                                type="text" className="form-control" placeholder="What course will your life take?" />
                            <span className="input-group-btn">
                                <button className="btn btn-secondary btn-success" type="submit">
                                    <span className="glyphicon glyphicon-search"></span>
                                </button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
Background.defaultProps = {
    imgs: ['/images/banner1.jpg', '/images/banner2.jpg']
}

export default Background