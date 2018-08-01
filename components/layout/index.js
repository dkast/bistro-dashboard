import React, { Component } from "react";
import { connect } from "react-redux";
import SideBar from "../navigation/sideBar";

class Layout extends Component {
  render() {
    const { sideBarExpanded, routeSelected } = this.props;

    return (
      <div className="wrapper">
        <SideBar selected={routeSelected} />
        <div className="main">
          <div className="container">{this.props.children}</div>
        </div>
        <style jsx>
          {`
            .main {
              position: relative;
              overflow: hidden;
              transition: all 0.15s;
              margin-left: ${sideBarExpanded ? "240" : "64"}px;
            }

            .wrapper {
              position: relative;
            }
          `}
        </style>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sideBarExpanded: state.uiState.sideBarExpanded,
  routeSelected: state.uiState.routeSelected
});

export default connect(mapStateToProps)(Layout);
