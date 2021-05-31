import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Modal, Col, Glyphicon, Row } from "react-bootstrap";
import {
  setUser,
  setGetMyCourses,
  addViewCourse,
  showModal,
  changeWishlist,
  takeCourse,
} from "../actions";
import { browserHistory, Link } from "react-router";
import Course from "../components/course";
var _ = require("lodash");
import {
  getCoursesRelateLecture,
  getReview,
  getCourseIntro,
} from "../apis/courses";

class ModalPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      message: "",
      isSubmitting: false,
    };
  }
  onHide() {
    this.setState({ show: false });
  }
  onClickPay(courseid) {
    if (this.props.courseCost > this.props.creditBalance) {
      this.setState({
        message: "The credit balance is not enough to make payments",
      });
      let alertlogin = $(".alert:first");
      alertlogin.show(500, function () {
        setTimeout(function () {
          alertlogin.hide(500);
        }, 3000);
      });
    } else {
      this.setState({ isSubmitting: true });
      $.post(
        // "/api/user/take-a-course",
        "http://localhost:5000/users/take-a-course",
        {
          courseid: courseid,
        },
        (data, status) => {
          if (data.code == 1001) {
            return this.props.onTakeCourseNotLoggedIn();
          }
          if (data.code == 200) {
            return this.props.onTakeCourseSuccess();
          }
          if (data.code == 404) {
            this.setState({ message: data.message });
            let alertlogin = $(".alert:first");
            alertlogin.show(500, function () {
              setTimeout(function () {
                alertlogin.hide(500);
              }, 3000);
            });
            this.setState({ isSubmitting: false });
          }
        }
      );
    }
  }
  render() {
    return (
      <Modal show={this.state.show} onHide={this.onHide.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center h3">
            Confirm purchase!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: "auto" }}>
          <div
            className="alert alert-danger text-center"
            role="alert"
            style={{ display: "none", marginBottom: 0 }}
          >
            {this.state.message}{" "}
          </div>
          <div className="row">
            <div className="col-xs-8">
              <h4>
                <strong>{this.props.courseName}</strong>
              </h4>
            </div>
            <div className="col-xs-4 text-right">
              <h4>
                <strong>
                  {this.props.courseCost == 0
                    ? "Free"
                    : this.props.courseCost + "$"}
                </strong>
              </h4>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-8">
              {" "}
              <h4>
                <strong>Credit Balance</strong>
              </h4>
            </div>
            <div className="col-xs-4 text-right">
              <h4>
                <strong>{this.props.creditBalance}$</strong>
              </h4>
            </div>
          </div>
          <hr style={{ borderColor: "silver" }} />
          <div className="row">
            <div className="col-xs-8">
              <h4>
                <strong>You pay</strong>
              </h4>
            </div>
            <div className="col-xs-4 text-right">
              <h4>
                <strong>{this.props.courseCost}$</strong>
              </h4>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            disabled={this.state.isSubmitting}
            onClick={() => {
              this.onClickPay(this.props.courseId);
            }}
            className="btn btn-success center-block"
          >
            Pay {this.props.courseCost}$
          </button>
          <h5 className="text-center">
            By clicking the "Pay" button, you agree to these{" "}
            <strong>
              <a target="_blank" href="/terms">
                Terms of Service
              </a>
            </strong>
          </h5>
        </Modal.Footer>
      </Modal>
    );
  }
}

class ViewCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageReviews: 1,
      reviews: [],
      showPreviewVideo: [],
      coursesRelatedLecturer: [],
    };
  }
  onClickPreview(lectureid) {
    let showPreviewVideo = this.state.showPreviewVideo;
    showPreviewVideo[lectureid] = !showPreviewVideo[lectureid];
    this.setState({ showPreviewVideo: showPreviewVideo });
  }
  onClickAddOrRemoveWishlist(courseid) {
    if (!this.props.islogged) {
      return this.props.dispatch(showModal(1));
    }
    $.post(
      "http://localhost:5000/users/change-wishlist",
      {
        courseid: courseid,
      },
      (data, status) => {
        this.props.dispatch(changeWishlist(data.action, courseid));
      }
    );
  }
  onClickTakeThisCourse(courseid) {
    if (!this.props.islogged) {
      return this.props.dispatch(showModal(1));
    }
    if (this.props.islearning) {
      return browserHistory.push("/course/" + courseid + "/learning");
    }
    this.refs.modalPurchase.setState({ show: true });
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.params.id != nextProps.params.id) {
      getReview(
        {
          courseid: Number(this.props.params.id),
          page: this.state.pageReviews,
        },
        (data, status) => {
          if (data.code == 200) {
            this.setState({ reviews: data.reviews });
          }
        }
      );
    }
    if (nextProps.course) {
      this.getCoursesRelateLecture(
        nextProps.course.lecturer._id,
        nextProps.params.id
      );
      $("html, body")
        .stop()
        .animate({ scrollTop: 0 }, "500", "swing", function () {});
      return;
    }
    getCourseIntro(
      {
        courseid: nextProps.params.id,
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          browserHistory.push("/");
          return;
        }
        if (data.code == 200) {
          this.props.dispatch(addViewCourse(data.course));
          this.getCoursesRelateLecture(
            data.course.lecturer._id,
            nextProps.params.id
          );
        }
      }
    );
  }
  componentDidMount() {
    getReview(
      {
        courseid: Number(this.props.params.id),
        page: this.state.pageReviews,
      },
      (data, status) => {
        if (data.code == 200) {
          this.setState({ reviews: data.reviews });
        }
      }
    );
    if (this.props.course) {
      var header = $("#navbar-info-course");
      var top = header.position().top + 47;
      $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll >= top) {
          if (!header.hasClass("navbar-fixed-top")) {
            header.addClass("navbar-fixed-top");
          }
        } else {
          if (header.hasClass("navbar-fixed-top")) {
            header.removeClass("navbar-fixed-top");
          }
        }
      });
      this.getCoursesRelateLecture(
        this.props.course.lecturer._id,
        Number(this.props.params.id)
      );
      return;
    }
    getCourseIntro(
      {
        courseid: Number(this.props.params.id),
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          browserHistory.push("/");
          return;
        }
        if (data.code == 200) {
          this.props.dispatch(addViewCourse(data.course));
          var header = $("#navbar-info-course");
          var top = header.position().top + 47;
          $(window).scroll(function () {
            var scroll = $(window).scrollTop();
            if (scroll >= top) {
              if (!header.hasClass("navbar-fixed-top")) {
                header.addClass("navbar-fixed-top");
              }
            } else {
              if (header.hasClass("navbar-fixed-top")) {
                header.removeClass("navbar-fixed-top");
              }
            }
          });
          this.getCoursesRelateLecture(
            data.course.lecturer._id,
            Number(this.props.params.id)
          );
        }
      }
    );
  }
  getCoursesRelateLecture(lecturerid, courseid) {
    getCoursesRelateLecture(
      {
        lecturerid: lecturerid,
        courseid: courseid,
      },
      (data, status) => {
        if (data.code == 200)
          this.setState({ coursesRelatedLecturer: data.courses });
      }
    );
  }
  onClickPrev() {
    let page = this.state.pageReviews;
    this.setState({ pageReviews: page - 1 });
    getReview(
      {
        courseid: Number(this.props.params.id),
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
        courseid: Number(this.props.params.id),
        page: page + 1,
      },
      (data, status) => {
        if (data.code == 200) {
          this.setState({ reviews: data.reviews });
        }
      }
    );
  }
  render() {
    if (!this.props.course) {
      return <div></div>;
    } else {
      let previewvideo = (
        <video
          id={"video-" + this.props.params.id}
          className="col-md-8 col-xs-12 video-js"
          controls
          preload="false"
          width="100%"
          height="auto"
          style={{ paddingLeft: "0px" }}
        >
          <source src={this.props.course.previewvideo} type="video/mp4" />
        </video>
      );
      let lv = (() => {
        switch (this.props.course.level) {
          case 0:
            return "All Levels";
          case 1:
            return "Beginner Level";
          case 2:
            return "Intermediate Level";
          case 3:
            return "Expert Level";
          default:
            return "All Levels";
        }
      })();
      let controls = (
        <div className="col-md-4 col-xs-12">
          <h2>
            <strong>
              {this.props.course.cost == 0
                ? "Free"
                : "$" + this.props.course.cost}
            </strong>
          </h2>
          {this.props.islearning ? (
            <button
              className="btn btn-success btn-lg"
              onClick={() => {
                this.onClickTakeThisCourse(Number(this.props.params.id));
              }}
            >
              <span className="glyphicon glyphicon-list-alt"></span> Start
              Learning Now
            </button>
          ) : (
            <button
              className="btn btn-success btn-lg"
              onClick={() => {
                this.onClickTakeThisCourse(Number(this.props.params.id));
              }}
            >
              <span className="glyphicon glyphicon-shopping-cart"></span>Take
              This Course
            </button>
          )}
          <hr style={{ borderColor: "silver" }} />
          <h5>
            Lectures : <strong>{this.props.course.lectures.length}</strong>
          </h5>
          <h5>
            Skill Level : <strong>{lv}</strong>
          </h5>
          <h5>
            Instructed by :{" "}
            <Link to={"/view-user/" + this.props.course.lecturer._id}>
              <strong>{this.props.course.lecturer.username}</strong>
            </Link>
          </h5>
          <h5>
            Category :{" "}
            <Link to={"/courses/" + this.props.course.genre._id}>
              <strong>{this.props.course.genre.name}</strong>
            </Link>
            {" / "}
            <Link
              to={
                "/courses/" +
                this.props.course.genre._id +
                "/" +
                this.props.course.subgenre._id
              }
            >
              <strong>{this.props.course.subgenre.name}</strong>
            </Link>
          </h5>
          <button
            className={
              "btn " + (this.props.wishlisted ? "btn-danger" : "btn-success")
            }
            onClick={(e) => {
              this.onClickAddOrRemoveWishlist(Number(this.props.params.id));
            }}
          >
            <span className="glyphicon glyphicon-heart"></span>{" "}
            {this.props.wishlisted ? "Wishlisted" : "Wishlist"}
          </button>
        </div>
      );
      return (
        <div>
          <div className="container">
            <h1>
              <em style={{ color: "teal" }}>{this.props.course.name}</em>
            </h1>
            <Glyphicon glyph="calendar" />
            <span>
              {" Created " +
                new Date(this.props.course.createdAt).toLocaleString()}
            </span>
            <div>
              <span className="course-rate">
                <span
                  style={{ width: (this.props.course.star || 0) * 20 + "%" }}
                ></span>
              </span>
              <span style={{ fontWeight: "bold" }}>
                {" " +
                  (this.props.course.star
                    ? this.props.course.star.toFixed(1)
                    : 0) +
                  "(" +
                  this.props.course.numberofreviews +
                  " ratings) • " +
                  this.props.course.numberofstudent +
                  " students enrolled"}
              </span>
            </div>

            <div className="row" style={{ marginTop: "15px" }}>
              {previewvideo}
              {controls}
            </div>
            <br />
          </div>
          <nav id="navbar-info-course" className="navbar navbar-default">
            <div className="container">
              <ul className="nav navbar-nav">
                <li>
                  <a href="#About">About This Course</a>
                </li>
                <li>
                  <a href="#Lectures">Lectures</a>
                </li>
                <li>
                  <a href="#Instructor">Instructor</a>
                </li>
                <li>
                  <a href="#Reviews">Reviews</a>
                </li>
              </ul>
            </div>
          </nav>
          <div className="container">
            <div className="row" style={{ marginTop: "20px" }}>
              <Col md={8} xs={12} style={{ paddingLeft: "0px" }}>
                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h1 id="About" className="panel-title">
                      About This Course
                    </h1>
                  </div>
                  <div className="panel-body">
                    <strong style={{ color: "#5bc0de" }}>
                      Course Description
                    </strong>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: this.props.course.description,
                      }}
                      style={{ fontSize: "16px", marginTop: "10px" }}
                    />
                    <strong style={{ color: "#5bc0de" }}>
                      What are the requirements?
                    </strong>
                    <div style={{ fontSize: "16px", marginTop: "10px" }}>
                      <ul>
                        {this.props.course.needtoknow
                          ? this.props.course.needtoknow.map((item, index) => {
                              return <li key={index}>{item}</li>;
                            })
                          : null}
                      </ul>
                    </div>
                    <strong style={{ color: "#5bc0de" }}>
                      What am I going to get from this course?
                    </strong>
                    <div style={{ fontSize: "16px", marginTop: "10px" }}>
                      <ul>
                        {this.props.course.willableto
                          ? this.props.course.willableto.map((item, index) => {
                              return <li key={index}>{item}</li>;
                            })
                          : null}
                      </ul>
                    </div>
                    <strong style={{ color: "#5bc0de" }}>
                      What is the target students?
                    </strong>
                    <div style={{ fontSize: "16px", marginTop: "10px" }}>
                      <ul>
                        {this.props.course.targetstudent
                          ? this.props.course.targetstudent.map(
                              (item, index) => {
                                return <li key={index}>{item}</li>;
                              }
                            )
                          : null}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="panel panel-primary">
                  <div className="panel-heading">
                    <h1 id="Lectures" className="panel-title">
                      Lectures
                    </h1>
                  </div>
                  <div className="panel-body">
                    {this.props.course.lectures.map((lecture, index) => {
                      return (
                        <div key={index} style={{ fontSize: "16px" }}>
                          <span className="glyphicon glyphicon-play-circle"></span>{" "}
                          Lecture {index + 1}: {lecture.name + " "}
                          {lecture.preview ? (
                            <button
                              onClick={() => {
                                this.onClickPreview(lecture._id);
                              }}
                              className="btn btn-info"
                            >
                              Preview
                            </button>
                          ) : (
                            ""
                          )}
                          {lecture.preview &&
                          this.state.showPreviewVideo[lecture._id] ? (
                            <video
                              className="video-js"
                              controls
                              preload="false"
                              width="100%"
                              height="auto"
                              style={{ paddingLeft: "0px", marginTop: "10px" }}
                            >
                              <source
                                src={
                                  "/api/resource/play-video-preview/" +
                                  lecture._id
                                }
                                type="video/mp4"
                              />
                            </video>
                          ) : (
                            ""
                          )}
                          {this.props.course.lectures.length != index + 1 ? (
                            <hr style={{ borderColor: "silver" }} />
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Col>
              <Col md={4} smHidden xsHidden>
                <Row>
                  <Col xs={12}>
                    <p>
                      <strong>
                        {"Courses taught by "}
                        <Link
                          to={"/view-user/" + this.props.course.lecturer._id}
                        >
                          {this.props.course.lecturer.username}
                        </Link>
                      </strong>
                    </p>
                  </Col>
                  {this.state.coursesRelatedLecturer
                    ? this.state.coursesRelatedLecturer.map((course, index) => {
                        return (
                          <Col xs={12} key={index}>
                            <Course popoverPlacement="left" course={course} />
                          </Col>
                        );
                      })
                    : null}
                </Row>
              </Col>
            </div>
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h1 id="Instructor" className="panel-title">
                  Instructor Biography
                </h1>
              </div>
              <div className="panel-body">
                <div className="row">
                  <div
                    className="col-xs-2 col-md-1"
                    style={{ paddingLeft: "0px", paddingRight: "0px" }}
                  >
                    <div
                      className="photo-profile"
                      style={{
                        backgroundImage:
                          "url(" +
                          ("/api/resource/images?src=" +
                            this.props.course.lecturer.photo +
                            "&w=100&h=100") +
                          ")",
                      }}
                    ></div>
                  </div>
                  <div className="col-xs-10 col-md-11">
                    <Link
                      to={"/view-user/" + this.props.course.lecturer._id}
                      className="lecturer-name"
                    >
                      {this.props.course.lecturer.username}
                    </Link>
                    <br className="hidden-xs" />
                    {this.props.course.lecturer.twitter ? (
                      <a
                        target="_blank"
                        href={
                          "https://twitter.com/" +
                          this.props.course.lecturer.twitter
                        }
                      >
                        <img
                          className="icon-social"
                          src="/images/Twitter-icon.png"
                        ></img>
                      </a>
                    ) : (
                      ""
                    )}
                    {this.props.course.lecturer.youtube ? (
                      <a
                        target="_blank"
                        href={
                          "https://www.youtube.com/" +
                          this.props.course.lecturer.youtube
                        }
                      >
                        <img
                          className="icon-social"
                          src="/images/YouTube-icon.png"
                        ></img>
                      </a>
                    ) : (
                      ""
                    )}
                    {this.props.course.lecturer.linkedin ? (
                      <a
                        target="_blank"
                        href={
                          "https://www.linkedin.com/" +
                          this.props.course.lecturer.linkedin
                        }
                      >
                        <img
                          className="icon-social"
                          src="/images/linkedin-icon.png"
                        ></img>
                      </a>
                    ) : (
                      ""
                    )}
                    {this.props.course.lecturer.website ? (
                      <a
                        target="_blank"
                        href={this.props.course.lecturer.website}
                      >
                        <img
                          className="icon-social"
                          src="/images/browser-icon.png"
                        ></img>
                      </a>
                    ) : (
                      ""
                    )}
                    {this.props.course.lecturer.googleid ? (
                      <a
                        target="_blank"
                        href={
                          "https://plus.google.com/" +
                          this.props.course.lecturer.googleid
                        }
                      >
                        <img
                          className="icon-social"
                          src="/images/google-plus-icon.png"
                        ></img>
                      </a>
                    ) : (
                      ""
                    )}
                    {this.props.course.lecturer.facebookid ? (
                      <a
                        target="_blank"
                        href={
                          "https://facebook.com/" +
                          this.props.course.lecturer.facebookid
                        }
                      >
                        <img
                          className="icon-social"
                          src="/images/facebook-icon.png"
                        ></img>
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.props.course.lecturer.biography,
                  }}
                  style={{ fontSize: "16px", marginTop: "10px" }}
                />
              </div>
            </div>

            <div className="panel panel-primary">
              <div className="panel-heading">
                <h1 id="Reviews" className="panel-title">
                  Reviews
                </h1>
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
                        Details({this.props.course.numberofreviews + " "}
                        reivews)
                      </strong>
                    </span>
                  </Col>
                  <Col xs={9} md={10}>
                    {this.state.reviews
                      ? this.state.reviews.map((review, index) => {
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
                                  {" " +
                                    new Date(review.createdAt).toLocaleString()}
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
                                  __html: review.content.replace(
                                    /\n/g,
                                    "<br/>"
                                  ),
                                }}
                                className="content-rate"
                              ></span>
                            </div>
                          );
                        })
                      : null}
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
                          <button
                            disabled={true}
                            className="btn btn-link btn-lg"
                          >
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
          <ModalPurchase
            ref="modalPurchase"
            courseName={this.props.course.name}
            courseId={Number(this.props.params.id)}
            courseCost={this.props.course.cost}
            creditBalance={this.props.creditBalance}
            onTakeCourseSuccess={() => {
              this.props.dispatch(
                takeCourse(Number(this.props.params.id), this.props.course.cost)
              );
              browserHistory.push(
                "/course/" + this.props.params.id + "/learning"
              );
            }}
            onTakeCourseNotLoggedIn={() => {
              this.props.dispatch(setUser({}));
              this.props.dispatch(setGetMyCourses(false));
              return browserHistory.push("/");
            }}
          />
        </div>
      );
    }
  }
}

ViewCourse = connect((state, props) => {
  let course = _.find(state.viewCourses, { _id: Number(props.params.id) });
  if (course) {
    return {
      course: course,
      islearning: _.includes(state.user.mylearningcourses, Number(props.params.id)),
      wishlisted: _.includes(state.user.mywishlist, Number(props.params.id)),
      islogged:
        state.hasOwnProperty("user") && state.user.hasOwnProperty("username"),
      creditBalance: state.user.creditbalance || 0,
    };
  }
  return props;
})(ViewCourse);

export default ViewCourse;
