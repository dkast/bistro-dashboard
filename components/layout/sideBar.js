import React, { Component } from "react";
import { connect } from "react-redux";
import css from "styled-jsx/css";
import SideNav, {
    Toggle,
    Nav,
    NavItem,
    NavIcon,
    NavText
  } from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";

class SideBar extends Component {

  onToggle = expanded => {
    this.props.onSetSideBarExpanded(expanded);
  };

  render() {
    return (
    <div>
      <SideNav onToggle={this.onToggle}>
        <Toggle />
        <Nav selected={this.props.selected}>
          <NavItem eventKey="home">
            <NavIcon>
                <i className="fe fe-mail" style={{ fontSize: '1.75em', verticalAlign: 'middle' }} />
            </NavIcon>
            <NavText>Home</NavText>
          </NavItem>
          <NavItem eventKey="users">
            <NavIcon>
                <i className="fe fe-user" style={{ fontSize: '1.75em', verticalAlign: 'middle' }} />
            </NavIcon>
            <NavText>Users</NavText>
          </NavItem>
        </Nav>
      </SideNav>
      <style jsx global>{`
        .sidenav---sidenav---_2tBP {
          background-color: #2d3436;
        }

        .sidenav---navicon---3gCRo i {
          color: rgba(255, 255, 255, 0.9) !important;
        }

        .sidenav---navtext---1AE_f {
          color: rgba(255, 255, 255, 0.8) !important;
        }
      `}</style>
    </div>
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