import React, { Component } from "react";
import { connect } from "react-redux";

class AccountMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="dropdown float-right">
        <span className="avatar avatar-placeholder mx-2" />
        <div className="dropdown-menu dropdown-menu-right show">
          <a className="dropdown-item" href="#">
            Action
          </a>
          <a className="dropdown-item" href="#">
            Another action
          </a>
          <a className="dropdown-item" href="#">
            Something else here
          </a>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(AccountMenu);
