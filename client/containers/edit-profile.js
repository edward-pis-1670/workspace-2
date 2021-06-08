import React from 'react'
import { connect } from 'react-redux';
import { setUser, setProfile } from '../actions'
import { browserHistory } from 'react-router'

class EditProfile extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            username: this.props.username,
            biography: this.props.biography,
            website: this.props.website,
            twitter: this.props.twitter,
            youtube: this.props.youtube,
            linkedin: this.props.linkedin,
            message: '',
            isSubmitting: false
        }
    }
    componentDidMount() {
        let editor = CKEDITOR.replace('ckeditor');
        editor.on('change', (e) => {
            // getData() returns CKEditor's HTML content.
            this.setState({ biography: e.editor.getData() })
        });
    }
    onSubmit(e) {
        e.preventDefault()

        this.setState({ isSubmitting: true })
        $.post(
            // '/api/user/edit-profile',
            'http://localhost:5000/users/edit-profile',
            {
                username: this.state.username,
                biography: this.state.biography,
                website: this.state.website,
                twitter: this.state.twitter,
                youtube: this.state.youtube,
                linkedin: this.state.linkedin
            },
            (data, status) => {
                if (data.code == 1001) {
                    this.props.dispatch(setUser({}))
                    return browserHistory.push('/')
                } else if (data.code == 200) {
                    this.props.dispatch(setProfile(data.profile))
                }
                let alertlogin = $(".alert:first")
                alertlogin.show(500, function () {
                    setTimeout(function () {
                        alertlogin.hide(500)
                    }, 3000)
                })
                this.setState({ message: data.message, isSubmitting: false })
            }
        )
    }

    handleUsername(e) {
        this.setState({ username: e.target.value })
    }
    // handleBiography(e) {
    //     this.setState({ biography: e.target.value })
    // }
    handleWebsite(e) {
        this.setState({ website: e.target.value })
    }
    handleYoutube(e) {
        this.setState({ youtube: e.target.value })
    }
    handleLinkedin(e) {
        this.setState({ linkedin: e.target.value })
    }
    handleTwitter(e) {
        this.setState({ twitter: e.target.value })
    }

    render() {
        return (
            <div>
                <div className="edit-user-header-box">
                    <p className="text-center"><strong>Profile</strong></p>
                    <p className="text-center">Add information about yourself to share on your profile.</p>
                </div>
                <div className="edit-user-content">
                    <form role="form" className="col-lg-offset-1 col-lg-9" onSubmit={this.onSubmit.bind(this)}>
                        <div className="alert alert-danger text-center" role="alert" style={{ display: 'none', marginBottom: 0 }}>{this.state.message} </div>
                        <div className="form-group">
                            <label>Username: </label>
                            <div className="input-group">
                                <span className="input-group-addon glyphicon glyphicon-user"></span>
                                <input type="text" className="form-control" placeholder="Username"
                                    value={this.state.username} onChange={this.handleUsername.bind(this)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Biography: </label>
                            <textarea className="form-control" rows="10" id="ckeditor" defaultValue={this.props.biography}></textarea>
                        </div>
                        <div className="form-group">
                            <label>Link: </label>
                            <div className="input-group">
                                <span className="input-group-addon glyphicon glyphicon-globe"></span>
                                <input type="url" className="form-control" placeholder="Website (http(s)://..)"
                                    value={this.state.website} onChange={this.handleWebsite.bind(this)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon fa fa-twitter" style={{ display: 'table-cell' }}></span>
                                <span className="input-group-addon">http://twitter.com/</span>
                                <input type="text" className="form-control" placeholder="Twitter Profile"
                                    value={this.state.twitter} onChange={this.handleTwitter.bind(this)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon fa fa-linkedin" style={{ display: 'table-cell' }}></span>
                                <span className="input-group-addon">http://www.linkedin.com/</span>
                                <input type="text" className="form-control" placeholder="Linkedin Profile"
                                    value={this.state.linkedin} onChange={this.handleLinkedin.bind(this)} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <span className="input-group-addon fa fa-youtube" style={{ display: 'table-cell' }}></span>
                                <span className="input-group-addon">http://www.youtube.com/</span>
                                <input type="text" className="form-control" placeholder="Youtube Profile"
                                    value={this.state.youtube} onChange={this.handleYoutube.bind(this)} />
                            </div>
                        </div>
                        <button disabled={this.state.isSubmitting} type="submit"
                            className="btn btn-success center-block">
                            <span className="glyphicon glyphicon-ok"></span>{' '}Save
                        </button>
                    </form>
                </div>

            </div>
        )
    }
}


EditProfile = connect((state) => {
    return {
        username: state.user.username,
        biography: state.user.biography || '',
        website: state.user.website || '',
        twitter: state.user.twitter || '',
        youtube: state.user.youtube || '',
        linkedin: state.user.linkedin || ''
    }
})(EditProfile)


export default EditProfile