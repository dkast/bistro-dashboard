import React, { Component } from "react";
import { connect } from "react-redux";
import SideBar from "../navigation/sideBar";
import NProgressStyles from "next-nprogress/styles";

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
            }

            .wrapper {
              position: relative;
              min-height: 100%;
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
