import React, { Component } from "react";
import { connect } from "react-redux";
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText
} from "@trendmicro/react-sidenav";

class Layout extends Component {
  // state = {
  //   selected: "home",
  //   expanded: false
  // };

  render() {
    // const { selected, expanded } = this.state;
    return (
      <div className="wrapper">
        <SideBar />
        <div className="container-fluid">{this.props.children}</div>
        <style jsx>
          {`
            .container-fluid {
              margin-left: 64px;
            }
          `}
        </style>
      </div>
    );
  }
}

class SideBar extends Component {
  onToggle = expanded => {
    //TODO: link to dispatch
  };

  render() {
    return (
      <SideNav onToggle={this.onToggle}>
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home" />
        <NavItem eventKey="home">
          <NavIcon>
            <i className="fe fe-mail" />
          </NavIcon>
          <NavText>Home</NavText>
        </NavItem>
      </SideNav>
    );
  }
}

const mapStateToProps = state => ({
  sideBarExpanded: state.uiState.sideBarExpanded,
  sideBarSelected: state.uiState.sideBarSelected
});

const mapDispatchToProps = dispatch => ({
  onSetSideBarExpanded: sideBarExpanded =>
    dispatch({ type: "SIDEBAR_EXPANDED_SET", sideBarExpanded })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
