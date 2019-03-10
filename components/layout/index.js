import React, { Component } from "react";
import { connect } from "react-redux";
// import NProgressStyles from "next-nprogress/styles";

import SideBar from "../navigation/sideBar";

class Layout extends Component {
  render() {
    const { sideBarExpanded, routeSelected } = this.props;

    return (
      <div className="wrapper">
        {/* <NProgressStyles color="#2684ff" spinner={false} /> */}
        <SideBar selected={routeSelected} expanded={sideBarExpanded} />
        <div className="main">
          <div className="page">
            <div className="page-main">{this.props.children}</div>
          </div>
        </div>
        <style jsx>{`
          .main {
            position: relative;
            overflow: hidden;
            transition: all 0.15s;
            margin-left: ${sideBarExpanded ? "240" : "64"}px;
          }

          .wrapper {
            position: relative;
            min-height: 100vh;
          }

          .container-fluid {
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sideBarExpanded: state.uiState.sideBarExpanded,
  routeSelected: state.uiState.routeSelected,
  notification: state.uiState.notification
});

const mapDispatchToProps = dispatch => ({
  onSetNotification: notification =>
    dispatch({ type: "NOTIFICATION_SET", notification })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
