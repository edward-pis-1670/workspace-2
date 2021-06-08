import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import { Breadcrumb, Glyphicon } from "react-bootstrap";
import { connect } from "react-redux";

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerColor: [
        "lightseagreen",
        "teal",
        "forestgreen",
        "green",
        "sienna",
        "peru",
        "indigo",
      ][Math.floor(Math.random() * 7)],
    };
  }

  render() {
    return (
      <div>
        <link rel="stylesheet" href="/stylesheets/semantic.min.css" />

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
              <Breadcrumb.Item active>Admin</Breadcrumb.Item>
            </Breadcrumb>
            <p className="genre-title">Admin Dashboard</p>
            <ul className="mycourses-navbar">
              <li>
                <Link
                  activeClassName="active"
                  onlyActiveOnIndex={true}
                  to="/admin/users"
                >
                  User
                </Link>
              </li>
              <li>
                <Link
                  activeClassName="active"
                  onlyActiveOnIndex={true}
                  to="/admin/courses"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  activeClassName="active"
                  onlyActiveOnIndex={true}
                  to="/admin/review-courses"
                >
                  Review Courses
                </Link>
              </li>
              <li>
                <Link
                  activeClassName="active"
                  onlyActiveOnIndex={true}
                  to="/admin/credit"
                >
                  Credit Card
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container">{this.props.children}</div>
      </div>
    );
  }
}
Admin = connect((state, props) => {
  console.log(state.user);
  if (state.hasOwnProperty("user") && state.user.hasOwnProperty("username")) {
    return {
      islogged: true,
    };
  }
  return props;
})(Admin);

export default Admin;
