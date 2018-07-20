import React, { Component } from "react";
import { connect } from "react-redux";
import SideNav, {
    Toggle,
    Nav,
    NavItem,
    NavIcon,
    NavText
  } from "@trendmicro/react-sidenav";

class SideBar extends Component {

  onToggle = expanded => {
    this.props.onSetSideBarExpanded(expanded);
  };

  render() {
    return (
    <SideNav onToggle={this.onToggle}>
      <SideNav.Toggle />
      <SideNav.Nav selected={this.props.sideBarSelected} />
      <NavItem eventKey="home">
        <NavIcon>
            <i className="fe fe-mail" style={{ fontSize: '1.75em', verticalAlign: 'middle' }} />
        </NavIcon>
        <NavText>Home</NavText>
        </NavItem>
    </SideNav>
    );
  }
}

const mapDispatchToProps = dispatch => ({
onSetSideBarExpanded: sideBarExpanded =>
  dispatch({ type: "SIDEBAR_EXPANDED_SET", sideBarExpanded })
});


export default connect(
  null,
  mapDispatchToProps
)(SideBar);