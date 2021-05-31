import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import {
  setUser,
  setGetMyCourses,
  setCourseDescription,
  setGenres,
  setCoursePreviewVideo,
} from "../actions";
import { browserHistory } from "react-router";
var _ = require("lodash");
import { getAllGenres } from "../apis/genres";

class ManageCourseDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course_name: this.props.course_name || "",
      course_description: this.props.course_description || "",
      course_image: this.props.course_image
        ? "/api/resource/images?src=" + this.props.course_image + "&w=320&h=180"
        : "",
      course_category: this.props.course_category || "",
      course_subcategory: this.props.course_subcategory || "",
      course_level: this.props.course_level || 0,
      file: {},
      progress_video: 0,
      previewvideoname: "",
      message: "",
      isSubmitting: false,
    };
  }
  componentDidMount() {
    let editor = CKEDITOR.replace("ckeditor");
    CKEDITOR.instances.ckeditor.setData(this.props.course_description);
    editor.on("change", (e) => {
      // getData() returns CKEditor's HTML content.
      this.setState({ course_description: e.editor.getData() });
    });
    if (!this.props.course_description) {
      // $.post('/api/user/get-course-description',
      $.post(
        "http://localhost:5000/users/get-description-course",
        { courseid: this.props.params.id },
        (data, status) => {
          if (data.code == 200) {
            this.props.dispatch(setCourseDescription(data.course));
            this.setState({
              course_name: data.course.name,
              course_description: data.course.description,
              course_image:
                "/api/resource/images?src=" +
                data.course.coverphoto +
                "&w=320&h=180",
              course_category: data.course.genre,
              course_subcategory: data.course.subgenre,
              course_level: data.course.level,
            });
            CKEDITOR.instances.ckeditor.setData(data.course.description);
          }
        }
      );
    }
    if (this.props.genreList.length == 0) {
      getAllGenres((result) => {
        this.props.dispatch(setGenres(JSON.parse(result)));
      });
    }
  }

  handleCourseName(e) {
    this.setState({ course_name: e.target.value });
  }
  handleLevel(e) {
    this.setState({ course_level: e.target.value });
  }
  handleCategory(e) {
    this.setState({ course_category: Number(e.target.value) });
  }
  handleSubcategory(e) {
    this.setState({ course_subcategory: Number(e.target.value) });
  }
  handleImageFile(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        course_image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  }
  handlePreviewVideo(e) {
    this.setState({ previewvideoname: e.target.files[0].name });
    let fd = new FormData();
    fd.append("previewvideo", e.target.files[0]);
    fd.append("courseid", this.props.params.id);
    $.ajax({
      method: "POST",
      url: "/api/user/upload-preview-video-course",
      data: fd,
      processData: false,
      contentType: false,
      success: (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        } else if (data.code == 200) {
          this.props.dispatch(
            setCoursePreviewVideo(data.previewvideo, this.props.params.id)
          );
          document.getElementById("video-" + this.props.params.id).load();
        }
      },
      xhr: () => {
        let xhr = new window.XMLHttpRequest();
        xhr.upload.addEventListener(
          "progress",
          (evt) => {
            if (evt.lengthComputable) {
              let percentComplete = Math.ceil((evt.loaded / evt.total) * 100);
              this.setState({ progress_video: percentComplete });
            }
          },
          false
        );
        return xhr;
      },
    });
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitting: true });
    let fd = new FormData();
    fd.append("courseid", this.props.params.id);
    fd.append("name", this.state.course_name);
    fd.append("description", this.state.course_description);
    fd.append("genre", this.state.course_category);
    fd.append("subgenre", this.state.course_subcategory);
    fd.append("level", this.state.course_level);
    fd.append("coverphoto", this.state.file);
    $.ajax({
      method: "POST",
      // url: '/api/user/set-course-description',
      url: "http://localhost:5000/users/set-description-course",
      data: fd,
      processData: false,
      contentType: false,
      success: (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        } else if (data.code == 200) {
          this.props.dispatch(setCourseDescription(data.course));
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
    let video;
    if (this.props.course_previewvideo) {
      video = (
        <div>
          <video
            id={"video-" + this.props.params.id}
            className="video-js center-block"
            controls
            preload="auto"
            width="640"
            height="auto"
          >
            <source src={this.props.course_previewvideo} type="video/mp4" />
          </video>
          <br />
        </div>
      );
    }
    let genreList = this.props.genreList.map((item, index) => {
      return (
        <option value={item._id} key={index}>
          {item.name}
        </option>
      );
    });
    let genre = _.find(this.props.genreList, {
      _id: this.state.course_category,
    });
    let subgenreList;
    if (genre) {
      subgenreList = genre.subgenres.map((item, index) => {
        return (
          <option value={item._id} key={index}>
            {item.name}
          </option>
        );
      });
    }

    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="managecourse-title-box">
          <h1>
            <em>Course Description</em>
          </h1>
        </div>
        <div className="managecourse-content">
          <div className="item">
            <label>Course Title</label>
            <input
              type="text"
              required
              className="form-control input-lg"
              placeholder="Course Title"
              value={this.state.course_name}
              onChange={this.handleCourseName.bind(this)}
            />
          </div>
          <div className="item">
            <label>Course Description</label>
            <textarea
              className="form-control"
              rows="10"
              id="ckeditor"
            ></textarea>
          </div>
          <div className="item">
            <label>Course Image: </label>
            <img
              className="center-block image-description"
              src={this.state.course_image}
            />
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
          <div className="item">
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
                      onChange={this.handlePreviewVideo.bind(this)}
                    />
                  </span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  readOnly={true}
                  value={this.state.previewvideoname || "None"}
                />
              </div>
            </div>
            <div
              className={
                "progress" + (this.state.progress_video ? "" : " hide")
              }
            >
              <div
                className="progress-bar progress-bar-striped active"
                style={{ width: this.state.progress_video + "%" }}
              >
                <span>{this.state.progress_video + "%"}</span>
              </div>
            </div>
          </div>
          <div className="item row">
            <div className="col-xs-6 col-md-4">
              <label>Select Level</label>
              <select
                className="form-control"
                value={this.state.course_level}
                onChange={this.handleLevel.bind(this)}
              >
                <option value={1}>Beginner Level</option>
                <option value={2}>Intermediate Level</option>
                <option value={3}>Expert Level</option>
                <option value={0}>All Levels</option>
              </select>
            </div>
            <div className="col-xs-6 col-md-4">
              <label>Select Category</label>
              <select
                required
                className="form-control"
                value={this.state.course_category}
                onChange={this.handleCategory.bind(this)}
              >
                <option>--Select Category--</option>
                {genreList}
              </select>
            </div>
            <div className="col-xs-6 col-md-4">
              <label>Select Subcategory</label>
              <select
                required
                className="form-control"
                value={this.state.course_subcategory}
                onChange={this.handleSubcategory.bind(this)}
              >
                <option>--Select Category--</option>
                {subgenreList}
              </select>
            </div>
          </div>
          <div
            className="alert alert-danger text-center"
            role="alert"
            style={{ display: "none", marginBottom: 0 }}
          >
            {this.state.message}{" "}
          </div>
        </div>

        <button
          type="submit"
          disabled={this.state.isSubmitting}
          className="btn btn-success center-block"
        >
          <span className="glyphicon glyphicon-ok"></span> Save
        </button>
      </form>
    );
  }
}

ManageCourseDescription = connect((state, props) => {
  if (state.user.mycourses) {
    let course = _.find(state.user.mycourses, { _id: Number(props.params.id) });
    if (course) {
      return {
        course_previewvideo: course.previewvideo,
        course_name: course.name,
        course_description: course.description,
        course_image: course.coverphoto,
        course_level: course.level,
        course_category: course.genre,
        course_subcategory: course.subgenre,
        genreList: state.genreList,
      };
    }
  }
  return { genreList: state.genreList };
})(ManageCourseDescription);

export default ManageCourseDescription;
