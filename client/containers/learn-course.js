import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router";
import { setUser, setGetMyCourses, addViewCourse } from "../actions";
import { Col, Row, Glyphicon } from "react-bootstrap";
import Review from "../components/review";
var _ = require("lodash");
import { getReview, getCourseIntro } from "../apis/courses";

class LearnCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageReviews: 1,
      reviews: [],
      currentLectureIndex: 0,
    };
  }
  onClickNextLecture() {
    this.setState({ currentLectureIndex: this.state.currentLectureIndex + 1 });
    document.getElementById("video").load();
  }
  onClickPrevLecture() {
    this.setState({ currentLectureIndex: this.state.currentLectureIndex - 1 });
    document.getElementById("video").load();
  }
  onClickViewLecture(index) {
    this.setState({ currentLectureIndex: index });
    document.getElementById("video").load();
  }

  componentDidMount() {
    getReview(
      {
        courseid: this.props.params.id,
        page: this.state.pageReviews,
      },
      (data, status) => {
        if (data.code == 200) {
          this.setState({ reviews: data.reviews });
        }
      }
    );
    if (this.props.course) {
      return;
    }
    getCourseIntro(
      {
        courseid: this.props.params.id,
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          browserHistory.push("/");
          return;
        }
        if (data.code == 200) {
          if (data.course.lectures.length != 0) {
            this.props.dispatch(addViewCourse(data.course));
          }
        }
      }
    );
  }
  onClickPrev() {
    let page = this.state.pageReviews;
    this.setState({ pageReviews: page - 1 });
    getReview(
      {
        courseid: this.props.params.id,
        page: page - 1,
      },
      (data, status) => {
        if (data.code == 200) {
          this.setState({ reviews: data.reviews });
        }
      }
    );
  }
  onClickNext() {
    let page = this.state.pageReviews;
    this.setState({ pageReviews: page + 1 });
    getReview(
      {
        courseid: this.props.params.id,
        page: page + 1,
      },
      (data, status) => {
        if (data.code == 200) {
          this.setState({ reviews: data.reviews });
        }
      }
    );
  }
  onClickWriteReview() {
    this.refs.review.setState({ show: true });
  }
  onSubmitReviewSuccess() {
    getReview(
      {
        courseid: this.props.params.id,
        page: this.state.pageReviews,
      },
      (data, status) => {
        if (data.code == 200) {
          this.setState({ reviews: data.reviews });
        }
      }
    );
  }
  render() {
    if (!this.props.course || this.props.course.lectures.length == 0)
      return <div></div>;
    return (
      <div>
        <link
          rel="stylesheet"
          href="/stylesheets/simple-sidebar-learning.css"
        />
        <div id="top-bar-learn" className="top-bar-learn row">
          <Col xs={1}>
            <button
              className="btn btn-link btn-lg text-left"
              onClick={() => {
                $("#wrapper").toggleClass("toggled");
              }}
            >
              <span className="glyphicon glyphicon-menu-hamburger"></span>
            </button>
          </Col>
          <Col xs={11}>
            <div className="top-bar-title h4">
              <button
                className="btn btn-link btn-lg"
                onClick={() => {
                  this.onClickPrevLecture();
                }}
                style={{
                  display: this.state.currentLectureIndex == 0 ? "none" : "",
                }}
              >
                <span className="glyphicon glyphicon-menu-left"></span>
              </button>
              {" " +
                this.props.course.lectures[this.state.currentLectureIndex]
                  .name +
                " "}
              <button
                className="btn btn-link btn-lg"
                onClick={() => {
                  this.onClickNextLecture();
                }}
                style={{
                  display:
                    this.state.currentLectureIndex ==
                    this.props.course.lectures.length - 1
                      ? "none"
                      : "",
                }}
              >
                <span className="glyphicon glyphicon-menu-right"></span>
              </button>
            </div>
          </Col>
        </div>
        <div id="wrapper">
          <div id="sidebar-wrapper">
            <ul className="sidebar-nav">
              <li className="sidebar-brand">{this.props.course.name}</li>
              {this.props.course.lectures.map((lecture, index) => (
                <li key={index}>
                  <span
                    style={{
                      color:
                        this.state.currentLectureIndex >= index
                          ? "#449d44"
                          : "",
                      display: "inline",
                    }}
                    className={
                      "glyphicon glyphicon-" +
                      (this.state.currentLectureIndex >= index
                        ? "ok"
                        : "unchecked")
                    }
                  ></span>
                  <a
                    style={{
                      color:
                        this.state.currentLectureIndex >= index
                          ? "#5bc0de"
                          : "white",
                      display: "inline",
                    }}
                    onClick={() => {
                      this.onClickViewLecture(index);
                    }}
                  >
                    {" " + (index + 1) + ". " + lecture.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div id="page-content-wrapper">
            <video
              id="video"
              className="video-js"
              controls
              preload="false"
              width="100%"
              height="auto"
            >
              <source
                src={
                  "/api/resource/play-video-learning/" +
                  this.props.params.id +
                  "/" +
                  this.props.course.lectures[this.state.currentLectureIndex]._id
                }
                type="video/mp4"
              />
            </video>
          </div>
        </div>
        <div className="container" style={{ marginTop: "30px" }}>
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h1 className="panel-title">Reviews</h1>
            </div>
            <div className="panel-body">
              <div className="row">
                <Col
                  xs={3}
                  md={2}
                  style={{ paddingLeft: "0px", paddingRight: "0px" }}
                >
                  <span>Avegare Rating</span>
                  <div
                    style={{
                      fontSize: "96px",
                      fontWeight: 600,
                      color: "#17aa1c",
                      lineHeight: 1,
                    }}
                  >
                    {this.props.course.star
                      ? this.props.course.star.toFixed(1)
                      : 0}
                  </div>
                  <div>
                    <span className="course-rate">
                      <span
                        style={{
                          width: (this.props.course.star || 0) * 20 + "%",
                        }}
                      ></span>
                    </span>
                  </div>
                  <span style={{ display: "block" }}>
                    <strong>
                      Details({this.props.course.numberofreviews + " "}reivews)
                    </strong>
                  </span>
                  {/*<div className="progress">
                                        <div className="progress-bar progress-bar-success"
                                            style={{ width: ((this.props.starRate['5'] ? this.props.starRate['5'] : 0) * 100 / this.props.course.reviews.length) + '%' }}>
                                            <span style={{ color: 'black', position: 'absolute' }}>
                                                {'5 Star( ' + (this.props.starRate['5'] ? this.props.starRate['5'] : 0) + ' vote )'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-success"
                                            style={{ width: ((this.props.starRate['4'] ? this.props.starRate['4'] : 0) * 100 / this.props.course.reviews.length) + '%' }}>
                                            <span style={{ color: 'black', position: 'absolute' }}>
                                                {'4 Star( ' + (this.props.starRate['4'] ? this.props.starRate['4'] : 0) + ' vote )'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-success"
                                            style={{ width: ((this.props.starRate['3'] ? this.props.starRate['3'] : 0) * 100 / this.props.course.reviews.length) + '%' }}>
                                            <span style={{ color: 'black', position: 'absolute' }}>
                                                {'3 Star( ' + (this.props.starRate['3'] ? this.props.starRate['3'] : 0) + ' vote )'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-success"
                                            style={{ width: ((this.props.starRate['2'] ? this.props.starRate['2'] : 0) * 100 / this.props.course.reviews.length) + '%' }}>
                                            <span style={{ color: 'black', position: 'absolute' }}>
                                                {'2 Star( ' + (this.props.starRate['2'] ? this.props.starRate['2'] : 0) + ' vote )'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <div className="progress-bar progress-bar-success"
                                            style={{ width: ((this.props.starRate['1'] ? this.props.starRate['1'] : 0) * 100 / this.props.course.reviews.length) + '%' }}>
                                            <span style={{ color: 'black', position: 'absolute' }}>
                                                {'1 Star( ' + (this.props.starRate['1'] ? this.props.starRate['1'] : 0) + ' vote )'}
                                            </span>
                                        </div>
                                    </div>*/}
                  <button
                    className="btn btn-primary btn-lg center-block"
                    style={{ marginTop: "10px" }}
                    onClick={() => {
                      this.onClickWriteReview();
                    }}
                  >
                    <span className="glyphicon glyphicon-pencil"></span> Write a
                    Review
                  </button>
                </Col>
                <Col xs={9} md={10}>
                  {this.state.reviews.map((review, index) => {
                    return (
                      <div className="info-rate" key={index}>
                        <img
                          className="avatar-rate"
                          src={
                            "/api/resource/images?src=" +
                            review.user.photo +
                            "&w=50&h=50"
                          }
                        />
                        <div
                          style={{
                            display: "inline-block",
                            verticalAlign: "middle",
                          }}
                        >
                          <Link
                            to={"/view-user/" + review.user._id}
                            className="username-rate"
                          >
                            {review.user.username}
                          </Link>
                          <Glyphicon
                            style={{ marginLeft: "10px" }}
                            glyph="calendar"
                          />
                          <span>
                            {" " + new Date(review.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="course-rate">
                            <span
                              style={{ width: review.star * 20 + "%" }}
                            ></span>
                          </span>
                        </div>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: review.content.replace(/\n/g, "<br/>"),
                          }}
                          className="content-rate"
                        ></span>
                      </div>
                    );
                  })}
                  <div className="text-center">
                    <ul className="pagination">
                      <li>
                        <button
                          disabled={this.state.pageReviews <= 1}
                          onClick={() => {
                            this.onClickPrev();
                          }}
                          className="btn btn-success btn-lg"
                        >
                          <span className="glyphicon glyphicon-chevron-left"></span>
                        </button>
                      </li>
                      <li>
                        <button disabled={true} className="btn btn-link btn-lg">
                          {this.state.pageReviews}
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            this.onClickNext();
                          }}
                          className="btn btn-success btn-lg"
                        >
                          <span className="glyphicon glyphicon-chevron-right"></span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </Col>
              </div>
            </div>
          </div>
        </div>
        <Review
          ref="review"
          user={this.props.user}
          course={{ _id: this.props.params.id }}
          onSubmitReviewSuccess={() => {
            this.onSubmitReviewSuccess();
          }}
        />
      </div>
    );
  }
}

LearnCourse = connect((state, props) => {
  let course = _.find(state.viewCourses, { _id: Number(props.params.id) });
  if (course) {
    return {
      course: course,
      user: {
        _id: state.user._id,
        username: state.user.username,
        photo: state.user.photo,
      },
    };
  }
  return props;
})(LearnCourse);

export default LearnCourse;
