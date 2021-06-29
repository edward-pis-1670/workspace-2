import React from "react";
import { Breadcrumb, Glyphicon, Row, Col, Pager } from "react-bootstrap";
import { browserHistory, Link } from "react-router";
import { setUser, setGetMyCourses, markRead } from "../actions";
import { connect } from "react-redux";
import { API_URL } from "../apis";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bsStyle: ["success", "info", "warning", "danger"][
        Math.floor(Math.random() * 4)
      ],
      headerColor: [
        "lightseagreen",
        "teal",
        "forestgreen",
        "green",
        "sienna",
        "peru",
        "indigo",
      ][Math.floor(Math.random() * 7)],
      notis: [],
      page: 1,
    };
  }
  componentDidMount() {
    $.post(
      API_URL + "/users/get-notification",
      { page: this.state.page },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        }
        if (data.code == 200) this.setState({ notis: data.notis });
      }
    );
  }
  markAsRead(e, noti, i) {
    e.preventDefault();
    if (!noti.seen) {
      // $.post('/api/user/mark-read-noti', { id: noti._id })
      $.post(API_URL + "/users/mark-read-notification", {
        id: noti._id,
      });
      let notis = this.state.notis;
      notis[i].seen = true;
      this.setState({ notis: notis });
      this.props.dispatch(markRead(noti._id));
    }
  }
  onClickNoti(e, noti, i) {
    this.markAsRead(e, noti, i);
    browserHistory.push(noti.url);
  }
  onClickPrev() {
    if (this.props.page <= 1) return;
    let page = this.state.page - 1;
    $.post(
      API_URL + "/users/get-notification",
      { page: page },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        }
        if (data.code == 200) this.setState({ notis: data.notis });
      }
    );
    this.setState({ page: page });
  }
  onClickNext() {
    let page = this.state.page + 1;
    $.post(
      API_URL + "/users/get-notification",
      { page: page },
      (data, status) => {
        if (data.code == 1001) {
          this.props.dispatch(setUser({}));
          this.props.dispatch(setGetMyCourses(false));
          return browserHistory.push("/");
        }
        if (data.code == 200) this.setState({ notis: data.notis });
      }
    );
    this.setState({ page: page });
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
              <Breadcrumb.Item active>Notifications</Breadcrumb.Item>
            </Breadcrumb>
            <p className="genre-title">Notifications</p>
          </div>
        </div>
        <div className="noti-container">
          <div className="noti-content">
            {this.state.notis.length != 0 ? (
              this.state.notis.map((noti, index) => (
                <div
                  className={"noti-item" + (noti.seen ? "" : " seen")}
                  key={index}
                >
                  <Row className="relative">
                    <Link
                      onClick={(e) => {
                        this.onClickNoti(e, noti, index);
                      }}
                    >
                      <Col xs={2}>
                        <img src={noti.from.photo} />
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
                          this.markAsRead(e, noti, index);
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
          <Pager>
            <Pager.Item
              disabled={this.state.page == 1}
              previous
              onClick={() => {
                this.onClickPrev();
              }}
            >
              &larr; Previous Page
            </Pager.Item>
            <Pager.Item
              next
              onClick={() => {
                this.onClickNext();
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

Notifications = connect()(Notifications);

export default Notifications;
