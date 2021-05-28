import React from "react";
import ReactDOM from "react-dom";
import FormLogin from "./form-login.js";
import FormSignup from "./form-signup.js";
import FormForgotPassword from "./form-forgotpassword.js";
import {
  setUser,
  showModal,
  setGetMyCourses,
  markAllAsRead,
  markRead,
} from "../actions";
import { connect } from "react-redux";
import { Glyphicon, Col, Row, Button } from "react-bootstrap";
import { Link, browserHistory } from "react-router";
import { logout } from "../apis/auth";

import _ from "lodash";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coursename: "",
    };
  }
  getUserInfo() {
    $.get("http://localhost:5000/users/me", (data, status) => {
      if (data.code == 200) {
        this.props.dispatch(setUser(data.user));
      } else {
        this.props.dispatch(setUser({}));
      }
    });
  }
  onClickLogout() {
    logout((data, status) => {
      localStorage.removeItem("token")
      if (data.code == 200) {
        this.props.dispatch(setUser({}));
        this.props.dispatch(setGetMyCourses(false));
        browserHistory.push("/");
      }
    });
  }
  componentWillMount() {
    this.getUserInfo();
  }
  showFormLogin() {
    this.props.dispatch(showModal(1));
  }
  showFormSignup() {
    this.props.dispatch(showModal(2));
  }
  showFormForgotPassword() {
    this.props.dispatch(showModal(3));
  }
  onSubmitSearch(e) {
    e.preventDefault();
    browserHistory.push("/courses/search?name=" + this.state.coursename);
    this.setState({ coursename: "" });
  }
  handleCourseName(e) {
    this.setState({ coursename: e.target.value });
  }
  markAllAsRead() {
    $.get("/api/user/mark-all-read-noti", (data, status) => {});
    this.props.dispatch(markAllAsRead());
  }
  markAsRead(e, noti) {
    e.preventDefault();
    if (!noti.seen) {
      $.post("/api/user/mark-read-noti", { id: noti._id });
      this.props.dispatch(markRead(noti._id));
    }
  }
  onClickNoti(e, noti) {
    this.markAsRead(e, noti);
    browserHistory.push(noti.url);
  }
  render() {
    let navbarRight;
    let formLogin, formSignup, formForgotPassword;
    let notiCount =
      this.props.notis && this.props.notis.length > 0
        ? this.props.notis
            .map((o) => (o.seen ? 0 : 1))
            .reduce((a, b) => a + b, 0)
        : 0;
    if (this.props.username == "") {
      navbarRight = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <a onClick={this.showFormLogin.bind(this)}>
              <span className="glyphicon glyphicon-log-in"></span> Login
            </a>
          </li>
          <li>
            <a onClick={this.showFormSignup.bind(this)}>
              <span className="glyphicon glyphicon-registration-mark"></span>{" "}
              Sign Up
            </a>
          </li>
        </ul>
      );
      formLogin = (
        <FormLogin
          ref="formLogin"
          onClickSignup={this.showFormSignup.bind(this)}
          onClickForgotPassword={this.showFormForgotPassword.bind(this)}
        />
      );
      formSignup = (
        <FormSignup
          ref="formSignup"
          onClickLogin={this.showFormLogin.bind(this)}
        />
      );
      formForgotPassword = (
        <FormForgotPassword
          ref="formForgotPassword"
          onClickLogin={this.showFormLogin.bind(this)}
        />
      );
    } else {
      navbarRight = (
        <ul className="nav navbar-nav navbar-right">
          <li>
            <Link to="/instructor">
              <span className="glyphicon glyphicon-pencil"></span> Instructor
            </Link>
          </li>
          <li>
            <Link to="/mycourses/learning">
              <span className="glyphicon glyphicon-list-alt"></span> Learning
            </Link>
          </li>
          <li>
            <Link>
              <Glyphicon glyph="bell" />
              {notiCount > 0 ? (
                <span className="badge noti-count">{notiCount}</span>
              ) : (
                ""
              )}
            </Link>
            <div className="noti-dropdown">
              <div className="noti-title">
                <span>Notifications</span>
                <a
                  onClick={() => {
                    this.markAllAsRead();
                  }}
                >
                  <span className="read-all">Mark all as read</span>
                </a>
              </div>
              <div className="noti-content">
                {this.props.notis && this.props.notis.length != 0 ? (
                  this.props.notis.map((noti, index) => (
                    <div
                      className={"noti-item" + (noti.seen ? "" : " seen")}
                      key={index}
                    >
                      <Row className="relative">
                        <Link
                          onClick={(e) => {
                            this.onClickNoti(e, noti);
                          }}
                        >
                          <Col xs={2}>
                            <img
                              src={
                                "/api/resource/images?src=" +
                                noti.from.photo +
                                "&w=50&h=50"
                              }
                            />
                          </Col>
                          <Col xs={9}>
                            <p className="noti-message">
                              {noti.title}:<span>{noti.message}</span>
                            </p>
                            <p className="noti-time">
                              <Glyphicon glyph="calendar" />
                              {new Date(noti.createdAt).toLocaleString()}
                            </p>
                          </Col>
                        </Link>
                        <Col xs={1} className="mark-as-read">
                          <span
                            onClick={(e) => {
                              this.markAsRead(e, noti);
                            }}
                            className={!noti.seen ? "green" : ""}
                          ></span>
                        </Col>
                      </Row>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No notifications.</p>
                )}
              </div>
              <div className="noti-footer">
                <Glyphicon glyph="eye-open" />
                <Link to="/notifications"> See all</Link>
              </div>
            </div>
          </li>
          <li className="dropdown">
            <a className="dropdown-toggle" data-toggle="dropdown">
              <span className="glyphicon glyphicon-user"></span>{" "}
              <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              {this.props.isAdmin ? (
                <li>
                  <Link to="/admin/users">
                    <span className="glyphicon glyphicon-king"></span> Admin
                    Page
                  </Link>
                </li>
              ) : (
                ""
              )}
              <li>
                <Link to="/user/edit-profile">
                  <span className="glyphicon glyphicon-user"></span> My Profile
                </Link>
              </li>
              <li>
                <Link to="/mycourses/wishlist">
                  <span className="glyphicon glyphicon-heart-empty"></span> My
                  Wishlist
                </Link>
              </li>
              <li className="divider"></li>
              <li>
                <a onClick={this.onClickLogout.bind(this)}>
                  <span className="glyphicon glyphicon-log-out"></span> Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      );
    }
    return (
      <div>
        {formLogin}
        {formSignup}
        {formForgotPassword}
        <nav className="navbar-main navbar navbar-default" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target=".navbar-ex1-collapse"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link to="/courses" className="navbar-brand center-block">
                Academy
              </Link>
            </div>
            <div className="collapse navbar-collapse navbar-ex1-collapse">
              <ul className="nav navbar-nav">
                <li>
                  <Link
                    onClick={() => {
                      $("#wrapper").toggleClass("toggled");
                    }}
                  >
                    Browse <Glyphicon glyph="list" />
                  </Link>
                </li>
              </ul>
              <form
                onSubmit={this.onSubmitSearch.bind(this)}
                className="navbar-form navbar-left"
              >
                <div className="input-group">
                  <span className="input-group-btn">
                    <button
                      className="btn btn-secondary btn-success"
                      type="submit"
                    >
                      <span className="glyphicon glyphicon-search"></span>
                    </button>
                  </span>
                  <input
                    value={this.state.coursename}
                    type="text"
                    className="form-control"
                    onChange={this.handleCourseName.bind(this)}
                    placeholder="Search for Courses"
                  />
                </div>
              </form>
              {navbarRight}
            </div>
          </div>
        </nav>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.hasOwnProperty("user") && state.user.hasOwnProperty("username")) {
    return {
      username: state.user.username,
      notis: state.user.notis,
      isAdmin: state.user.role == 1,
    };
  } else {
    return { username: "" };
  }
}

// export default connect()(Navbar)
export default connect(mapStateToProps)(Navbar);
