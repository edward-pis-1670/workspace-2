import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { setUser, setGetMyCourses, setCourseGoals } from "../actions";
import { browserHistory } from "react-router";
import { API_URL } from "../apis";
var _ = require("lodash");

class ManageCourseGoal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      needtoknow: props.needtoknow || [],
      targetstudent: props.targetstudent || [],
      willableto: props.willableto || [],
      current_needtoknow: "",
      current_targetstudent: "",
      current_willableto: "",
      message: "",
      isSubmitting: false,
    };
  }
  componentDidMount() {
    if (!this.props.needtoknow) {
      // $.post('/api/user/get-course-goals',
      $.post(
        API_URL + "/users/get-goals-course",
        { courseid: Number(this.props.params.id) },
        (data, status) => {
          if (data.code == 200) {
            console.log(data);
            this.props.dispatch(setCourseGoals(data.course));
            this.setState({
              needtoknow: data.course.needtoknow,
              willableto: data.course.willableto,
              targetstudent: data.course.targetstudent,
            });
          }
        }
      );
    }
  }
  handleNTK(e) {
    this.setState({ current_needtoknow: e.target.value });
  }
  handleEditNTK(e, index) {
    let needtoknow = this.state.needtoknow;
    needtoknow[index] = e.target.value;
    this.setState({ needtoknow: needtoknow });
  }
  onClickDeleteNTK(e, index) {
    let needtoknow = this.state.needtoknow;
    needtoknow.splice(index, 1);
    this.setState({ needtoknow: needtoknow });
  }
  onClickAddNTK() {
    this.setState({
      needtoknow: [...this.state.needtoknow, this.state.current_needtoknow],
    });
    this.setState({ current_needtoknow: "" });
  }
  //targetstudent
  handleTS(e) {
    this.setState({ current_targetstudent: e.target.value });
  }
  handleEditTS(e, index) {
    let ts = this.state.targetstudent;
    ts[index] = e.target.value;
    this.setState({ targetstudent: ts });
  }
  onClickDeleteTS(e, index) {
    let ts = this.state.targetstudent;
    ts.splice(index, 1);
    this.setState({ targetstudent: ts });
  }
  onClickAddTS() {
    this.setState({
      targetstudent: [
        ...this.state.targetstudent,
        this.state.current_targetstudent,
      ],
    });
    this.setState({ current_targetstudent: "" });
  }
  //willableto
  handleWAT(e) {
    this.setState({ current_willableto: e.target.value });
  }
  handleEditWAT(e, index) {
    let wat = this.state.willableto;
    wat[index] = e.target.value;
    this.setState({ willableto: wat });
  }
  onClickDeleteWAT(e, index) {
    let wat = this.state.willableto;
    wat.splice(index, 1);
    this.setState({ willableto: wat });
  }
  onClickAddWAT() {
    this.setState({
      willableto: [...this.state.willableto, this.state.current_willableto],
    });
    this.setState({ current_willableto: "" });
  }
  onSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitting: true });
    $.post(
      // '/api/user/set-course-goals',
      API_URL + "/users/set-goals-course",
      {
        courseid: Number(this.props.params.id),
        needtoknow: this.state.needtoknow,
        targetstudent: this.state.targetstudent,
        willableto: this.state.willableto,
      },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        } else if (data.code == 200) {
          this.props.dispatch(setCourseGoals(data.course));
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
    let needtoknow = this.state.needtoknow.map((item, index) => {
      return (
        <div
          className="input-group"
          key={index}
          style={{ marginBottom: "10px" }}
        >
          <input
            type="text"
            required
            className="form-control"
            placeholder="What will students need to know or do before starting this course?"
            value={this.state.needtoknow[index]}
            onChange={(e) => {
              this.handleEditNTK(e, index);
            }}
          />
          <div className="input-group-btn">
            <button
              type="button"
              className="btn btn-danger"
              onClick={(e) => {
                this.onClickDeleteNTK(e, index);
              }}
            >
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          </div>
        </div>
      );
    });
    let targetstudent = this.state.targetstudent.map((item, index) => {
      return (
        <div
          className="input-group"
          key={index}
          style={{ marginBottom: "10px" }}
        >
          <input
            type="text"
            required
            className="form-control"
            placeholder="What will students need to know or do before starting this course?"
            value={this.state.targetstudent[index]}
            onChange={(e) => {
              this.handleEditTS(e, index);
            }}
          />
          <div className="input-group-btn">
            <button
              type="button"
              className="btn btn-danger"
              onClick={(e) => {
                this.onClickDeleteTS(e, index);
              }}
            >
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          </div>
        </div>
      );
    });
    let willableto = this.state.willableto.map((item, index) => {
      return (
        <div
          className="input-group"
          key={index}
          style={{ marginBottom: "10px" }}
        >
          <input
            type="text"
            required
            className="form-control"
            placeholder="What will students need to know or do before starting this course?"
            value={this.state.willableto[index]}
            onChange={(e) => {
              this.handleEditWAT(e, index);
            }}
          />
          <div className="input-group-btn">
            <button
              type="button"
              className="btn btn-danger"
              onClick={(e) => {
                this.onClickDeleteWAT(e, index);
              }}
            >
              <span className="glyphicon glyphicon-trash"></span>
            </button>
          </div>
        </div>
      );
    });
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <div className="managecourse-title-box">
          <h1>
            <em>Course Goals</em>
          </h1>
        </div>
        <div className="managecourse-content">
          <div className="item">
            <label>
              What will students need to know or do before starting this course?
            </label>
            {needtoknow}
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                placeholder="What will students need to know or do before starting this course?"
                value={this.state.current_needtoknow}
                onChange={this.handleNTK.bind(this)}
              />
              <div className="input-group-btn">
                <button
                  type="button"
                  disabled={this.state.current_needtoknow == ""}
                  className="btn btn-success"
                  onClick={this.onClickAddNTK.bind(this)}
                >
                  <span className="glyphicon glyphicon-plus-sign"></span>
                </button>
              </div>
            </div>
          </div>
          <div className="item">
            <label>Who is your target student?</label>
            {targetstudent}
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                placeholder="Who is your target student?"
                value={this.state.current_targetstudent}
                onChange={this.handleTS.bind(this)}
              />
              <div className="input-group-btn">
                <button
                  type="button"
                  disabled={this.state.current_targetstudent == ""}
                  className="btn btn-success"
                  onClick={this.onClickAddTS.bind(this)}
                >
                  <span className="glyphicon glyphicon-plus-sign"></span>
                </button>
              </div>
            </div>
          </div>
          <div className="item">
            <label>At the end of my course, students will be able to...</label>
            {willableto}
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                placeholder="At the end of my course, students will be able to..."
                value={this.state.current_willableto}
                onChange={this.handleWAT.bind(this)}
              />
              <div className="input-group-btn">
                <button
                  type="button"
                  disabled={this.state.current_willableto == ""}
                  className="btn btn-success"
                  onClick={this.onClickAddWAT.bind(this)}
                >
                  <span className="glyphicon glyphicon-plus-sign"></span>
                </button>
              </div>
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

ManageCourseGoal = connect((state, props) => {
  if (state.user.mycourses) {
    let course = _.find(state.user.mycourses, { _id: Number(props.params.id) });
    if (course.needtoknow) {
      return {
        needtoknow: course.needtoknow,
        targetstudent: course.targetstudent,
        willableto: course.willableto,
      };
    }
    return props;
  }
  return props;
})(ManageCourseGoal);

export default ManageCourseGoal;
