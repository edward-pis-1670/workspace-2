import React from 'react'
import ReactDOM from 'react-dom'
import { setUser, setGetMyCourses, showModal } from '../actions'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

class VerifyEmail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            success: false
        }
    }
    componentDidMount() {
        $.post('/api/user/verify',
            {
                verifytoken: this.props.params.verifytoken
            }, (data, status) => {
                this.setState({ success: data.code == 200 })
            })
    }

    render() {
        let divStyle = {
            backgroundImage: 'url(/images/bg_verify.png)'
        }
        return (
            <div className="home-bg-form" style={divStyle} >
                <div className='container'>
                    {this.state.success ?
                        <div className='home-form'>
                            <h3 style={{ color: 'gainsboro' }}>Your email is verified</h3>
                            <h3 style={{ color: 'gainsboro' }}> Please login and start to learning a courses</h3>
                            <button className='btn btn-success btn-lg' onClick={() => { this.props.dispatch(showModal(1)) } }>Login</button>
                        </div> :
                        <div className='home-form'>
                            <h1 style={{ color: 'gainsboro' }}>Seems like we’re a bit lost.</h1>
                            <button className='btn btn-danger btn-lg' onClick={() => { browserHistory.push('/courses') } }>Go to Homepage</button>
                        </div>
                    }
                </div>
            </div >
        )
    }
}
VerifyEmail = connect()(VerifyEmail)

export default VerifyEmail