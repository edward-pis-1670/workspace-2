import React from "react";
import { connect } from "react-redux";
import { setPhoto, setUser } from "../actions";
import { browserHistory } from "react-router";
import { API_URL } from "../apis";

class EditPhoto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {},
      imagePreviewUrl: this.props.imagePreviewUrl,
      message: "",
      isSubmitting: false,
    };
  }

  handleImageFile(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }

  onSubmit(e) {
    e.preventDefault();
    let fd = new FormData();
    fd.append("avatar", this.state.file);
    this.setState({ isSubmitting: true });
    $.ajax({
      method: "POST",
      // url: "/api/user/edit-photo",
      url: API_URL + "/users/edit-avatar",
      data: fd,
      processData: false,
      contentType: false,
      success: (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          return browserHistory.push("/");
        } else if (data.code == 200) {
          this.props.dispatch(setPhoto(data.photo));
        }
        let alertlogin = $(".alert:first");
        alertlogin.show(500, function () {
          setTimeout(function () {
            alertlogin.hide(500);
          }, 3000);
        });
        this.setState({ message: data.message, isSubmitting: false });
      },
    });
  }

  render() {
    return (
      <div>
        <div className="edit-user-header-box">
          <p className="text-center">
            <strong>Photo</strong>
          </p>
          <p className="text-center">
            Add a nice photo of yourself for your profile.
          </p>
        </div>
        <div className="edit-user-content">
          <form
            role="form"
            className="col-lg-offset-1 col-lg-9"
            onSubmit={this.onSubmit.bind(this)}
          >
            <div
              className="alert alert-danger text-center"
              role="alert"
              style={{ display: "none", marginBottom: 0 }}
            >
              {this.state.message}{" "}
            </div>
            <div className="form-group">
              <label>Image Preview: </label>
              <div className="preview-photo-box">
                <img
                  className="center-block"
                  src={this.state.imagePreviewUrl}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Upload Image: </label>
              <div className="input-group">
                <label className="input-group-btn">
                  <span
                    className="btn btn-primary glyphicon glyphicon-picture"
                    style={{ top: 0 }}
                  >
                    <input
                      type="file"
                      onChange={this.handleImageFile.bind(this)}
                      style={{ display: "none", multiple: "" }}
                    />
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  readOnly={true}
                  value={this.state.file.name || ""}
                />
              </div>
            </div>
            <button
              disabled={this.state.isSubmitting}
              type="submit"
              className="btn btn-success center-block"
            >
              <span className="glyphicon glyphicon-ok"></span> Save
            </button>
          </form>
        </div>
      </div>
    );
  }
}

EditPhoto = connect((state) => {
  return {
    imagePreviewUrl: state.user.photo,
  };
})(EditPhoto);

export default EditPhoto;
