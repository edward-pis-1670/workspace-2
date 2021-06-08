import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import {
  setUser,
  setGetMyCourses,
  setCourseLectures,
  addLecture,
  deleteLecture,
  setLectureVideo,
  setLectureName,
  setLecturePreview,
} from "../actions";
import { browserHistory } from "react-router";
var _ = require("lodash");

class ModalAddLecture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      lecturename: "",
      message: "",
      isSubmitting: false,
    };
  }
  hideModal() {
    this.setState({ showModal: false, coursename: "" });
  }
  handleLectureName(e) {
    this.setState({ lecturename: e.target.value });
  }

  render() {
    return (
      <Modal show={this.state.showModal} onHide={this.hideModal.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center h3">ADD LECTURE</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: "auto" }}>
          <div
            className="alert alert-danger text-center"
            role="alert"
            style={{ display: "none", marginBottom: 0 }}
          >
            {this.state.message}{" "}
          </div>
          <form
            className="form-horizontal"
            onSubmit={this.props.onSubmitAddLecture.bind(this)}
          >
            <div className="form-group form-group-lg">
              <div className="input-group col-sm-offset-1 col-sm-10">
                <span className="input-group-addon glyphicon glyphicon-bookmark"></span>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Lecture's name"
                  onChange={this.handleLectureName.bind(this)}
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-sm-offset-1 col-sm-10">
                <button
                  disabled={this.state.isSubmitting}
                  type="submit"
                  className="btn btn-success btn-lg btn-block"
                >
                  ADD
                </button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

class ManageCourseLecture extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress_list: [],
      lecturename_list: [],
      videoname_list: [],
    };
  }
  showModal() {
    this.refs.modalAddLecture.setState({ showModal: true });
  }
  componentDidMount() {
    if (!this.props.lectures) {
      // $.post('/api/user/get-course-lectures',
      $.post(
        "http://localhost:5000/users/get-lectures-course",
        { courseid: Number(this.props.params.id) },
        (data, status) => {
          if (data.code == 200) {
            this.props.dispatch(setCourseLectures(data.course));
          }
        }
      );
    }
  }
  onSubmitAddLecture(e) {
    e.preventDefault();
    this.refs.modalAddLecture.setState({ isSubmitting: true });
    // $.post('/api/user/add-course-lecture',
    $.post(
      "http://localhost:5000/users/add-video-lecture",
      {
        courseid: Number(this.props.params.id),
        name: this.refs.modalAddLecture.state.lecturename,
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        }
        if (data.code == 200) {
          this.props.dispatch(
            addLecture(data.lecture, Number(this.props.params.id))
          );
          return this.refs.modalAddLecture.setState({
            isSubmitting: false,
            lecturename: "",
            showModal: false,
          });
        }
        let alertlogin = $(".alert:first");
        alertlogin.show(500, function () {
          setTimeout(function () {
            alertlogin.hide(500);
          }, 3000);
        });
        this.refs.modalCreateCourse.setState({
          message: data.message,
          isSubmitting: false,
        });
      }
    );
  }
  onSubmitDeleteLecture(e, lectureid) {
    e.preventDefault();
    $.post(
      // "/api/user/delete-course-lecture",
      "http://localhost:5000/users/delete-video-lectures",
      {
        courseid: Number(this.props.params.id),
        lectureid: Number(lectureid),
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        }
        if (data.code == 200) {
          this.props.dispatch(
            deleteLecture(lectureid, Number(this.props.params.id))
          );
        }
      }
    );
  }
  onSubmitSetLectureName(e, lectureid) {
    e.preventDefault();
    $.post(
      // "/api/user/set-lecture-name",
      "http://localhost:5000/users/set-name-lecture",
      {
        courseid: Number(this.props.params.id),
        lectureid: Number(lectureid),
        name: this.state.lecturename_list[lectureid],
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        }
        if (data.code == 200) {
          this.props.dispatch(
            setLectureName(data.lecture, Number(this.props.params.id))
          );
        }
      }
    );
  }
  handleLectureName(e, lectureid) {
    let lecturename_list = this.state.lecturename_list;
    lecturename_list[lectureid] = e.target.value;
    this.setState({ lecturename_list: lecturename_list });
  }
  handleVideoLecture(e, lectureid) {
    e.preventDefault();
    let videoname_list = this.state.videoname_list;
    videoname_list[lectureid] = e.target.files[0].name;
    this.setState({ videoname_list: videoname_list });

    let fd = new FormData();
    fd.append("video", e.target.files[0]);
    fd.append("courseid", Number(this.props.params.id));
    fd.append("lectureid", Number(lectureid));
    $.ajax({
      method: "POST",
      // url: "/api/user/upload-video-lecture",
      url: "http://localhost:5000/users/upload-video-lecture",
      data: fd,
      processData: false,
      contentType: false,
      success: (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          return browserHistory.push("/");
        } else if (data.code == 200) {
          console.log(data.lecture);
          this.props.dispatch(
            setLectureVideo(data.lecture, Number(this.props.params.id))
          );
          document.getElementById("video-" + lectureid).load();
        }
      },
      xhr: () => {
        let xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          "progress",
          (evt) => {
            if (evt.lengthComputable) {
              let percentComplete = Math.ceil((evt.loaded / evt.total) * 100);
              let progress_list = this.state.progress_list;
              progress_list[lectureid] = percentComplete;
              this.setState({ progress_list: progress_list });
            }
          },
          false
        );
        return xhr;
      },
    });
  }
  onClickSetPreview(e, lectureid) {
    e.preventDefault();
    $.post(
      // "/api/user/change-preview-lecture",
      "http://localhost:5000/users/change-preview-lecture",
      {
        courseid: Number(this.props.params.id),
        lectureid: Number(lectureid),
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        }
        if (data.code == 200) {
          this.props.dispatch(
            setLecturePreview(data.lecture, Number(this.props.params.id))
          );
        }
      }
    );
  }

  render() {
    let lectures;
    if (this.props.lectures) {
      lectures = this.props.lectures.map((lecture, index) => {
        let video;
        if (lecture.video) {
          video = (
            <div>
              <video
                id={"video-" + lecture._id}
                className="video-js center-block"
                controls
                preload="false"
                width="640"
                height="auto"
              >
                <source src={lecture.video} type="video/mp4" />
              </video>
              <br />
            </div>
          );
        }
        return (
          <div className="item box white" key={index}>
            <form
              onSubmit={(e) => {
                this.onSubmitSetLectureName(e, lecture._id);
              }}
            >
              <div className="input-group input-group-lg">
                <div className="input-group-btn">
                  <button
                    type="button"
                    className={"btn" + (lecture.preview ? " btn-primary" : "")}
                    onClick={(e) => {
                      this.onClickSetPreview(e, lecture._id);
                    }}
                  >
                    <span
                      className={
                        "glyphicon glyphicon-eye-" +
                        (lecture.preview ? "open" : "close")
                      }
                    ></span>
                  </button>
                </div>
                <span className="input-group-addon">Lecture {index + 1}:</span>
                <input
                  type="text"
                  className="form-control"
                  value={
                    this.state.lecturename_list[lecture._id] == null
                      ? lecture.name
                      : this.state.lecturename_list[lecture._id]
                  }
                  onChange={(e) => {
                    this.handleLectureName(e, lecture._id);
                  }}
                />
                <div className="input-group-btn">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={
                      lecture.name ==
                        this.state.lecturename_list[lecture._id] ||
                      !this.state.lecturename_list[lecture._id]
                    }
                  >
                    <span className="glyphicon glyphicon-save"></span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={(e) => {
                      this.onSubmitDeleteLecture(e, lecture._id);
                    }}
                  >
                    <span className="glyphicon glyphicon-trash"></span>
                  </button>
                </div>
              </div>
            </form>
            <br />
            {video}
            <div className="form-group">
              <label>Upload Video: </label>
              <div className="input-group">
                <label className="input-group-btn">
                  <span
                    className="btn btn-primary glyphicon glyphicon-film"
                    style={{ top: 0 }}
                  >
                    <input
                      type="file"
                      style={{ display: "none", multiple: "" }}
                      onChange={(e) => {
                        this.handleVideoLecture(e, lecture._id);
                      }}
                    />
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  readOnly={true}
                  value={this.state.videoname_list[lecture._id] || "None"}
                />
              </div>
            </div>
            <div
              className={
                "progress" +
                (this.state.progress_list[lecture._id] ? "" : " hide")
              }
            >
              <div
                className="progress-bar progress-bar-striped active"
                style={{ width: this.state.progress_list[lecture._id] + "%" }}
              >
                <span>{this.state.progress_list[lecture._id] + "%"}</span>
              </div>
            </div>
          </div>
        );
      });
    }
    return (
      <div>
        <div className="managecourse-title-box">
          <h1>
            <em>Lectures</em>
          </h1>
        </div>
        <div className="managecourse-content">{lectures}</div>
        <button
          className="btn btn-danger btn-lg btn-block"
          onClick={this.showModal.bind(this)}
        >
          <span className="glyphicon glyphicon-plus-sign"></span> Add Lecture
        </button>
        <ModalAddLecture
          ref="modalAddLecture"
          onSubmitAddLecture={this.onSubmitAddLecture.bind(this)}
        />
      </div>
    );
  }
}

ManageCourseLecture = connect((state, props) => {
  if (state.user.mycourses) {
    let course = _.find(state.user.mycourses, { _id: Number(props.params.id) });
    return {
      lectures: course.lectures,
    };
  }
  return props;
})(ManageCourseLecture);

export default ManageCourseLecture;
