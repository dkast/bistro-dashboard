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
import { Router } from "../../routes";

class SideBar extends Component {
  onToggle = expanded => {
    this.props.onSetSideBarExpanded(expanded);
  };

  onSelect = selected => {
    this.props.onSetRouteSelected(selected);
    Router.pushRoute(selected);
  };

  render() {
    return (
      <>
        <SideNav
          onToggle={this.onToggle}
          onSelect={this.onSelect}
          expanded={this.props.expanded}
        >
          <Toggle />
          <Nav selected={this.props.selected}>
            <NavItem eventKey="/">
              <NavIcon>
                <i
                  className="fe fe-home"
                  style={{ fontSize: "1.75em", verticalAlign: "middle" }}
                />
              </NavIcon>
              <NavText>Home</NavText>
            </NavItem>
            <NavItem eventKey="/items/library">
              <NavIcon>
                <i
                  className="fe fe-grid"
                  style={{ fontSize: "1.75em", verticalAlign: "middle" }}
                />
              </NavIcon>
              <NavText>Items</NavText>
            </NavItem>
          </Nav>
        </SideNav>
        <style jsx global>{`
          .sidenav---sidenav---_2tBP {
            background-color: #2d3436 !important;
          }

          .sidenav---navicon---3gCRo i {
            color: rgba(255, 255, 255, 0.9) !important;
          }

          .sidenav---navtext---1AE_f {
            color: rgba(255, 255, 255, 0.8) !important;
          }
        `}</style>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  onSetSideBarExpanded: sideBarExpanded =>
    dispatch({ type: "SIDEBAR_EXPANDED_SET", sideBarExpanded }),
  onSetRouteSelected: routeSelected =>
    dispatch({ type: "SIDEBAR_SELECTED_SET", routeSelected })
});

export default connect(
  null,
  mapDispatchToProps
)(SideBar);
