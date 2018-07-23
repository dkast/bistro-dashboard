import React, { Component } from "react";
import { connect } from "react-redux";
import SideBar from "../navigation/sideBar";

class Layout extends Component {
  render() {
    const { sideBarExpanded, sideBarSelected } = this.props;

    return (
      <div className="wrapper">
        <SideBar selected={sideBarSelected} />
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
          `}
        </style>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sideBarExpanded: state.uiState.sideBarExpanded,
  sideBarSelected: state.uiState.sideBarSelected
});

export default connect(mapStateToProps)(Layout);
