import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { setUser, setGetMyCourses, setCoursePrice } from "../actions";
import { browserHistory } from "react-router";
var _ = require("lodash");

class ManageCoursePrice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cost: this.props.cost,
      message: "",
      isSubmitting: false,
    };
  }
  handleCost(e) {
    this.setState({ cost: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitting: true });
    $.post(
      // '/api/user/set-course-price',
      "http://localhost:5000/users/set-price-course",
      {
        courseid: Number(this.props.params.id),
        cost: this.state.cost,
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        } else if (data.code == 200) {
          this.props.dispatch(setCoursePrice(data.course));
        }
        let alertlogin = $(".alert:first");
        alertlogin.show(500, function () {
          setTimeout(function () {
            alertlogin.hide(500);
          }, 3000);
        });
        this.setState({ message: data.message, isSubmitting: false });
      }
    );
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="managecourse-title-box">
          <h1>
            <em>Course Price</em>
          </h1>
        </div>
        <div className="managecourse-content">
          <div className="item">
            <label>Course Price</label>
            <div className="input-group input-group-lg">
              <input
                required
                type="number"
                min="0"
                className="form-control"
                placeholder="Course Price"
                value={this.state.cost || 0}
                onChange={this.handleCost.bind(this)}
              />
              <span className="input-group-addon glyphicon glyphicon-usd"></span>
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

ManageCoursePrice = connect((state, props) => {
  if (state.user.mycourses) {
    let course = _.find(state.user.mycourses, { _id: Number(props.params.id) });
    return {
      cost: course.cost,
    };
  }
  return props;
})(ManageCoursePrice);

export default ManageCoursePrice;
