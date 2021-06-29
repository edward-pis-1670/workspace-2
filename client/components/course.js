import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { showModal, changeWishlist } from "../actions";

import { OverlayTrigger, Tooltip, Popover } from "react-bootstrap";

import { Link } from "react-router";
import { API_URL } from "../apis";

class Course extends React.Component {
  onClickAddOrRemoveWishlist(e) {
    e.preventDefault();
    if (!this.props.islogged) {
      return this.props.dispatch(showModal(1));
    }
    $.post(
      API_URL + "/users/change-wishlist",
      {
        courseid: Number(this.props.course._id),
      },
      (data, status) => {
        console.log(this.props.course._id);
        this.props.dispatch(
          changeWishlist(data.action, Number(this.props.course._id))
        );
      }
    );
  }
  render() {
    let popover = (
      <Popover
        className="hidden-xs"
        id={"popover-" + Number(this.props.course._id)}
        title="Course Description"
      >
        <div
          className="popover-course"
          dangerouslySetInnerHTML={{ __html: this.props.course.description }}
        ></div>
      </Popover>
    );
    return (
      <OverlayTrigger
        trigger={["hover", "focus"]}
        placement={this.props.popoverPlacement}
        overlay={popover}
      >
        <Link
          to={"/course/" + Number(this.props.course._id)}
          className="course"
        >
          <div style={{ backgroundColor: "black" }}>
            <img className="course-img" src={this.props.course.coverphoto} />
          </div>
          <div className="course-info">
            <span className="course-title">{this.props.course.name}</span>
            <div>
              <span className="course-rate">
                <span
                  style={{ width: (this.props.course.star || 0) * 20 + "%" }}
                ></span>
              </span>
              <span>
                {" " +
                  (this.props.course.star || 0).toFixed(1) +
                  "(" +
                  this.props.course.numberofreviews +
                  ")"}
              </span>
            </div>
            <div className="text-danger">
              <strong>
                {!this.props.course.cost || this.props.course.cost == 0
                  ? "Free"
                  : "$" + this.props.course.cost}
              </strong>
            </div>
          </div>
          <OverlayTrigger
            placement="left"
            overlay={
              <Tooltip id={Number(this.props.course._id)}>Wishlist</Tooltip>
            }
          >
            <button
              type="button"
              className="course-wishlist"
              onClick={(e) => {
                this.onClickAddOrRemoveWishlist(e);
              }}
            >
              <span
                className={
                  "glyphicon glyphicon-heart" +
                  (this.props.wishlisted ? " active" : "")
                }
              ></span>
            </button>
          </OverlayTrigger>
          <div className="course-author">
            <img src={this.props.course.lecturer.photo} />
            <span>{this.props.course.lecturer.username}</span>
          </div>
        </Link>
      </OverlayTrigger>
    );
  }
}

Course = connect((state, props) => {
  if (state.hasOwnProperty("user") && state.user.hasOwnProperty("username")) {
    return {
      islogged: true,
      wishlisted: _.includes(state.user.mywishlist, Number(props.course._id)),
    };
  }
  return {
    islogged: false,
    wishlisted: false,
  };
})(Course);

export default Course;
