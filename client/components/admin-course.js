import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import { Breadcrumb, Glyphicon, Pager } from "react-bootstrap";
import { Header, Image, Table, Icon, Button, Modal } from "semantic-ui-react";
import { connect } from "react-redux";
import _ from "lodash";
import { setUser, setGetMyCourses } from "../actions";

class ModalShowLectures extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      course: {},
    };
  }
  handleOpen(e, course) {
    this.setState({
      modalOpen: true,
      course: course,
    });
  }
  handleClose(e) {
    this.setState({
      modalOpen: false,
    });
  }
  render() {
    return (
      <Modal open={this.state.modalOpen} onClose={this.handleClose.bind(this)}>
        <Modal.Header>{this.state.course.name}</Modal.Header>
        <Modal.Content>
          {this.state.course.lectures
            ? this.state.course.lectures.map((lecture, index) => {
                return (
                  <div key={index}>
                    <strong>
                      Lecture {index + 1}: {lecture.name}
                    </strong>
                    <video
                      id={"video-" + lecture._id}
                      controls
                      preload="false"
                      width="100%"
                      height="auto"
                    >
                      <source
                        src={"/api/resource/play-video-admin/" + lecture._id}
                        type="video/mp4"
                      />
                    </video>

                    <hr />
                  </div>
                );
              })
            : ""}
        </Modal.Content>
      </Modal>
    );
  }
}

class AdminCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: "",
      courses: [],
    };
  }
  viewCourse(e, course) {
    this.modalViewCourse.handleOpen(e, course);
  }
  componentDidMount() {
    this.setState({ searchQuery: this.props.location.query.searchQuery || "" });
    $.post(
      "http://localhost:5000/admin/get-courses",
      this.props.location.query,
      (data, status) => {
        if (data.code == 200) {
          this.setState({ courses: data.courses });
        } else if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          browserHistory.push("/courses");
        }
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.query != nextProps.location.query) {
      this.setState({
        searchQuery: nextProps.location.query.searchQuery || "",
      });
      $.post(
        "http://localhost:5000/admin/get-courses",
        nextProps.location.query,
        (data, status) => {
          if (data.code == 200) {
            this.setState({ courses: data.courses });
          } else if (data.code == 1001) {
            this.props.dispatch(setUser({}));
            this.props.dispatch(setGetMyCourses(false));
            browserHistory.push("/courses");
          }
        }
      );
    }
  }
  onClickPrev(e) {
    e.preventDefault();
    let query = this.props.location.query;
    if (!query.page || query.page <= 1) {
      return;
    }
    let url =
      "/admin/courses" +
      "?page=" +
      (query.page - 1) +
      (query.searchQuery ? "&searchQuery=" + query.searchQuery : "") +
      (query.sort ? "&sort=" + query.sort : "");
    browserHistory.push(url);
  }
  onClickNext(e) {
    e.preventDefault();
    let query = this.props.location.query;
    if (!query.page) {
      query.page = 1;
    }
    let url =
      "/admin/courses" +
      "?page=" +
      (parseInt(query.page) + 1) +
      (query.searchQuery ? "&searchQuery=" + query.searchQuery : "") +
      (query.sort ? "&sort=" + query.sort : "");
    browserHistory.push(url);
  }
  onChangeFilterSort(e) {
    e.preventDefault();
    let query = this.props.location.query;
    if (!query.page) {
      query.page = 1;
    }
    let url =
      "/admin/courses" +
      "?page=" +
      query.page +
      (query.searchQuery ? "&searchQuery=" + query.searchQuery : "") +
      "&sort=" +
      e.target.value;
    browserHistory.push(url);
  }
  onSubmitFormSearch(e) {
    e.preventDefault();
    let query = this.props.location.query;
    if (!query.page) {
      query.page = 1;
    }
    let url =
      "/admin/courses" +
      "?page=" +
      query.page +
      (this.state.searchQuery != ""
        ? "&searchQuery=" + this.state.searchQuery
        : "") +
      (query.sort ? "&sort=" + query.sort : "");
    browserHistory.push(url);
  }
  handleSearchQuery(e) {
    this.setState({ searchQuery: e.target.value });
    if (e.target.value == "") {
      let query = this.props.location.query;
      if (!query.page) {
        query.page = 1;
      }
      let url =
        "/admin/courses" +
        "?page=" +
        query.page +
        (query.sort ? "&sort=" + query.sort : "");
      browserHistory.push(url);
    }
  }
  deleteCourse(_id) {
    $.post("/api/admin/delete-course", { _id: _id }, (data, status) => {
      if (data.code == 200) {
        let courses = this.state.courses;
        let index = _.findIndex(courses, (o) => o._id == _id);
        this.setState({
          courses: [...courses.slice(0, index), ...courses.slice(index + 1)],
        });
      } else if (data.code == 1001) {
        browserHistory.push("/courses");
      }
    });
  }
  render() {
    return (
      <div>
        <form
          className="form-inline"
          style={{ marginBottom: "20px" }}
          onSubmit={(e) => this.onSubmitFormSearch(e)}
        >
          <div className="form-group form-group-lg">
            <label className="control-label">Sort by:</label>{" "}
            <select
              style={{ fontWeight: "bold" }}
              className="form-control"
              value={this.props.location.query.sort || "1"}
              onChange={(e) => this.onChangeFilterSort(e)}
            >
              <option value="1" style={{ fontWeight: "bold" }}>
                Name: A-to-Z
              </option>
              <option value="2" style={{ fontWeight: "bold" }}>
                Name: Z-to-A
              </option>
            </select>
          </div>{" "}
          <div className="form-group form-group-lg">
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                value={this.state.searchQuery}
                placeholder="Search course's name"
                onChange={(e) => this.handleSearchQuery(e)}
              />
              <span className="input-group-btn">
                <button className="btn btn-default" type="submit">
                  <Glyphicon glyph="search" />
                </button>
              </span>
            </div>
          </div>
        </form>
        <Table basic="very" celled collapsing>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Course</Table.HeaderCell>
              <Table.HeaderCell>Information</Table.HeaderCell>
              <Table.HeaderCell>Requirement</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Public</Table.HeaderCell>
              <Table.HeaderCell>Instructor</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.courses.map((course, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{course.name}</Table.Cell>
                  <Table.Cell>
                    {course.genre ? (
                      <div>
                        <strong>
                          Category :{" "}
                          <a
                            target="_blank"
                            href={"/courses/" + course.genre._id}
                          >
                            {course.genre.name}
                          </a>{" "}
                          /{" "}
                          <a
                            target="_blank"
                            href={
                              "/courses/" +
                              course.genre._id +
                              "/" +
                              course.subgenre._id
                            }
                          >
                            {course.subgenre.name}
                          </a>
                        </strong>
                        <br />
                      </div>
                    ) : (
                      ""
                    )}
                    <strong>
                      Skill Level :{" "}
                      {(() => {
                        switch (course.level) {
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
                      })()}
                    </strong>
                    <br />
                    <Glyphicon glyph="calendar" />
                    <span>
                      {" Created " +
                        new Date(course.createdAt).toLocaleString()}
                    </span>
                    <div>
                      <span className="course-rate">
                        <span
                          style={{ width: (course.star || 0) * 20 + "%" }}
                        ></span>
                      </span>
                      <span style={{ fontWeight: "bold" }}>
                        {" " +
                          (course.star ? course.star.toFixed(1) : 0) +
                          "(" +
                          course.numberofreviews +
                          " ratings) • " +
                          course.numberofstudent +
                          " students enrolled"}
                      </span>
                    </div>
                    <hr />
                    <strong style={{ color: "#5bc0de" }}>Description</strong>
                    <div
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <strong style={{ color: "#5bc0de" }}>
                      What are the requirements?
                    </strong>
                    <ul>
                      {course.needtoknow.map((item, index) => {
                        return <li key={index}>{item}</li>;
                      })}
                    </ul>
                    <strong style={{ color: "#5bc0de" }}>
                      What am I going to get from this course?
                    </strong>
                    <ul>
                      {course.willableto.map((item, index) => {
                        return <li key={index}>{item}</li>;
                      })}
                    </ul>
                    <strong style={{ color: "#5bc0de" }}>
                      What is the target students?
                    </strong>
                    <ul>
                      {course.targetstudent.map((item, index) => {
                        return <li key={index}>{item}</li>;
                      })}
                    </ul>
                  </Table.Cell>
                  <Table.Cell>{course.cost + "$"}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {course.public ? (
                      <Icon color="green" name="checkmark" size="large" />
                    ) : (
                      ""
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <a
                      target="_blank"
                      href={"/view-user/" + course.lecturer._id}
                    >
                      {course.lecturer.username + ""}
                    </a>
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button.Group size="mini">
                      <Button
                        positive
                        onClick={(e) => this.viewCourse(e, course)}
                      >
                        <Glyphicon glyph="eye-open" />
                      </Button>
                      <Button.Or />
                      <Button
                        negative
                        onClick={(e) => this.deleteCourse(course._id)}
                      >
                        <Glyphicon glyph="trash" />
                      </Button>
                    </Button.Group>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <ModalShowLectures ref={(ref) => (this.modalViewCourse = ref)} />
        <Pager>
          <Pager.Item
            disabled={
              !this.props.location.query.page ||
              this.props.location.query.page == 1
            }
            previous
            onClick={(e) => {
              this.onClickPrev(e);
            }}
          >
            &larr; Previous Page
          </Pager.Item>
          <Pager.Item
            next
            onClick={(e) => {
              this.onClickNext(e);
            }}
          >
            Next Page &rarr;
          </Pager.Item>
        </Pager>
      </div>
    );
  }
}

AdminCourse = connect()(AdminCourse);

export default AdminCourse;
