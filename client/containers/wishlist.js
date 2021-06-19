import React from "react";
import { browserHistory, Link } from "react-router";
import {
  Breadcrumb,
  Glyphicon,
  Button,
  Row,
  Col,
  Pager,
  ProgressBar,
} from "react-bootstrap";
import { setUser, setGetMyCourses } from "../actions";
import { connect } from "react-redux";
import Course from "../components/course";

class Wishlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bsStyle: ["success", "info", "warning", "danger"][
        Math.floor(Math.random() * 4)
      ],
      coursename: this.props.location.query.name || "",
      headerColor: [
        "lightseagreen",
        "teal",
        "forestgreen",
        "green",
        "sienna",
        "peru",
        "indigo",
      ][Math.floor(Math.random() * 7)],
      courses: [],
      isloading: true,
      progress: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.location.query != nextProps.location.query) {
      this.setState({
        courses: [],
        coursename: nextProps.location.query.name || "",
        headerColor: [
          "lightseagreen",
          "teal",
          "forestgreen",
          "green",
          "sienna",
          "peru",
          "indigo",
        ][Math.floor(Math.random() * 7)],
        bsStyle: ["success", "info", "warning", "danger"][
          Math.floor(Math.random() * 4)
        ],
        progress: 0,
        isloading: true,
      });
      $.ajax({
        method: "POST",
        // url: '/api/user/wishlist',
        url: "http://localhost:5000/users/wishlist",
        data: nextProps.location.query,
        success: (data, status) => {
          if (data.code == 1001) {
            this.props.dispatch(setUser({}));
            this.props.dispatch(setGetMyCourses(false));
            return browserHistory.push("/");
          } else if (data.code == 200) {
            setTimeout(() => {
              this.setState({ courses: data.courses, isloading: false });
            }, 500);
          }
        },
        xhr: () => {
          let xhr = new window.XMLHttpRequest();
          xhr.onprogress = (evt) => {
            if (evt.lengthComputable) {
              let percentComplete = Math.ceil((evt.loaded * 100.0) / evt.total);
              this.setState({ progress: percentComplete });
            }
          };
          return xhr;
        },
      });
    }
  }
  componentDidMount() {
    $.ajax({
      method: "POST",
      url: "http://localhost:5000/users/wishlist",
      data: this.props.location.query,
      success: (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        } else if (data.code == 200) {
          setTimeout(() => {
            this.setState({ courses: data.courses, isloading: false });
          }, 500);
        }
      },
      xhr: () => {
        let xhr = new window.XMLHttpRequest();
        xhr.onprogress = (evt) => {
          if (evt.lengthComputable) {
            let percentComplete = Math.ceil((evt.loaded * 100.0) / evt.total);
            this.setState({ progress: percentComplete });
          }
        };
        return xhr;
      },
    });
  }
  onClickPrev(e) {
    e.preventDefault();
    let query = this.props.location.query;
    if (!query.page || query.page <= 1) {
      return;
    }
    let url =
      "/mycourses/wishlist" +
      "?page=" +
      (query.page - 1) +
      (query.name ? "&name=" + query.name : "") +
      (query.level ? "&level=" + query.level : "") +
      (query.free ? "&free=" + query.free : "") +
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
      "/mycourses/wishlist" +
      "?page=" +
      (parseInt(query.page) + 1) +
      (query.name ? "&name=" + query.name : "") +
      (query.level ? "&level=" + query.level : "") +
      (query.free ? "&free=" + query.free : "") +
      (query.sort ? "&sort=" + query.sort : "");
    browserHistory.push(url);
  }
  onChangeFilterLevel(e) {
    e.preventDefault();
    let query = this.props.location.query;
    if (!query.page) {
      query.page = 1;
    }
    let url =
      "/mycourses/wishlist" +
      "?page=" +
      query.page +
      (query.name ? "&name=" + query.name : "") +
      (e.target.value == "none" ? "" : "&level=" + e.target.value) +
      (query.free ? "&free=" + query.free : "") +
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
      "/mycourses/wishlist" +
      "?page=" +
      query.page +
      (query.name ? "&name=" + query.name : "") +
      (query.level ? "&level=" + query.level : "") +
      (query.free ? "&free=" + query.free : "") +
      "&sort=" +
      e.target.value;
    browserHistory.push(url);
  }
  onChangeFilterPrice(e) {
    e.preventDefault();
    let query = this.props.location.query;
    if (!query.page) {
      query.page = 1;
    }
    let url =
      "/mycourses/wishlist" +
      "?page=" +
      query.page +
      (query.name ? "&name=" + query.name : "") +
      (query.level ? "&level=" + query.level : "") +
      (e.target.value == "none" ? "" : "&free=" + e.target.value) +
      (query.sort ? "&sort=" + query.sort : "");
    browserHistory.push(url);
  }
  onSubmitFormSearch(e) {
    e.preventDefault();
    let query = this.props.location.query;
    if (!query.page) {
      query.page = 1;
    }
    let url =
      "/mycourses/wishlist" +
      "?page=" +
      query.page +
      (this.state.coursename != "" ? "&name=" + this.state.coursename : "") +
      (query.level ? "&level=" + query.level : "") +
      (query.free ? "&free=" + query.free : "") +
      (query.sort ? "&sort=" + query.sort : "");
    browserHistory.push(url);
  }
  handleCourseName(e) {
    this.setState({ coursename: e.target.value });
    if (e.target.value == "") {
      let query = this.props.location.query;
      if (!query.page) {
        query.page = 1;
      }
      let url =
        "/mycourses/wishlist" +
        "?page=" +
        query.page +
        (query.level ? "&level=" + query.level : "") +
        (query.free ? "&free=" + query.free : "") +
        (query.sort ? "&sort=" + query.sort : "");
      browserHistory.push(url);
    }
  }
  render() {
    return (
      <div>
        <div
          className="genre-info-box"
          style={{ backgroundColor: this.state.headerColor }}
        >
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item
                onClick={(e) => {
                  e.preventDefault();
                  browserHistory.push("/courses");
                }}
              >
                <Glyphicon glyph="home" />
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Wishlist</Breadcrumb.Item>
            </Breadcrumb>
            <p className="genre-title">Wishlist</p>
            <ul className="mycourses-navbar">
              <li>
                <Link to="/mycourses/learning">Learning</Link>
              </li>
              <li>
                <Link
                  activeClassName="active"
                  onlyActiveOnIndex={true}
                  to="/mycourses/wishlist"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/instructor">My Courses</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container">
          <form
            className="form-inline"
            style={{ marginBottom: "20px" }}
            onSubmit={(e) => {
              this.onSubmitFormSearch(e);
            }}
          >
            <div className="form-group form-group-lg">
              <select
                style={{ fontWeight: "bold" }}
                className="form-control"
                value={this.props.location.query.level || "none"}
                onChange={(e) => {
                  this.onChangeFilterLevel(e);
                }}
              >
                <option value="none" style={{ fontWeight: "bold" }}>
                  --Select Level--
                </option>
                <option value="1" style={{ fontWeight: "bold" }}>
                  Beginner Level
                </option>
                <option value="2" style={{ fontWeight: "bold" }}>
                  Intermediate Level
                </option>
                <option value="3" style={{ fontWeight: "bold" }}>
                  Expert Level
                </option>
                {/* <option value='0' style={{ fontWeight: 'bold' }}>All Levels</option> */}
              </select>
            </div>{" "}
            <div className="form-group form-group-lg">
              <select
                style={{ fontWeight: "bold" }}
                className="form-control"
                value={this.props.location.query.free || "none"}
                onChange={(e) => {
                  this.onChangeFilterPrice(e);
                }}
              >
                <option value="none" style={{ fontWeight: "bold" }}>
                  --Price--
                </option>
                <option value="false" style={{ fontWeight: "bold" }}>
                  Paid
                </option>
                <option value="true" style={{ fontWeight: "bold" }}>
                  Free
                </option>
              </select>
            </div>{" "}
            <div className="form-group form-group-lg">
              <label className="control-label">Sort by:</label>{" "}
              <select
                style={{ fontWeight: "bold" }}
                className="form-control"
                value={this.props.location.query.sort || "1"}
                onChange={(e) => {
                  this.onChangeFilterSort(e);
                }}
              >
                <option value="1" style={{ fontWeight: "bold" }}>
                  Title: A-to-Z
                </option>
                <option value="2" style={{ fontWeight: "bold" }}>
                  Title: Z-to-A
                </option>
              </select>
            </div>{" "}
            <div className="form-group form-group-lg">
              <div className="input-group input-group-lg">
                <input
                  type="text"
                  className="form-control"
                  value={this.state.coursename}
                  placeholder="Search"
                  onChange={(e) => {
                    this.handleCourseName(e);
                  }}
                />
                <span className="input-group-btn">
                  <button className="btn btn-default" type="submit">
                    <Glyphicon glyph="search" />
                  </button>
                </span>
              </div>
            </div>
          </form>
        </div>
        <div className="container">
          {this.state.isloading ? (
            <ProgressBar
              bsStyle={this.state.bsStyle}
              active
              now={this.state.progress}
            />
          ) : (
            <Row>
              {this.state.courses.map((course, index) => {
                return (
                  <Col md={3} xs={6} key={index}>
                    <Course
                      popoverPlacement={index % 2 == 0 ? "right" : "left"}
                      course={course}
                    />
                  </Col>
                );
              })}
            </Row>
          )}
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
      </div>
    );
  }
}
Wishlist = connect()(Wishlist);

export default Wishlist;
