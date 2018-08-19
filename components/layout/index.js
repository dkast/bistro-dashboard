import React, { Component } from "react";
import { connect } from "react-redux";
import NProgressStyles from "next-nprogress/styles";

import SideBar from "../navigation/sideBar";

class Layout extends Component {
  render() {
    const { sideBarExpanded, routeSelected } = this.props;

    return (
      <div className="wrapper">
        <NProgressStyles color="#29d" spinner={false} />
        <SideBar selected={routeSelected} expanded={sideBarExpanded} />
        <div className="main">
          <div className="container-fluid">{this.props.children}</div>
        </div>
        <style jsx>
          {`
            .main {
              position: relative;
              overflow: hidden;
              transition: all 0.15s;
              margin-left: ${sideBarExpanded ? "240" : "64"}px;
              height: 100%;
            }

            .wrapper {
              position: relative;
              min-height: 100%;
              height: 100%;
            }

            .container-fluid {
              height: 100%;
            }
          `}
        </style>
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
