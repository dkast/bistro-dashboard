import React, { Component } from "react";
import { connect } from "react-redux";
import NProgressStyles from "next-nprogress/styles";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

import SideBar from "../navigation/sideBar";

class Layout extends Component {
  addNotification = () => {
    this.notificationDOMRef.addNotification({
      title: "Pruebas",
      message: "Mensaje de prueba",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "fadeIn"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 2000 },
      dismissable: { click: true }
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.showNotification !== prevProps.showNotification) {
      if (this.props.showNotification) {
        this.addNotification();
        this.props.onSetShowNotification(false);
      }
    }
  }

  render() {
    const { sideBarExpanded, routeSelected } = this.props;

    return (
      <div className="wrapper">
        <NProgressStyles color="#29d" spinner={false} />
        <ReactNotification ref={input => (this.notificationDOMRef = input)} />
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
  showNotification: state.uiState.showNotification
});

const mapDispatchToProps = dispatch => ({
  onSetShowNotification: showNotification =>
    dispatch({ type: "SHOW_NOTIFICATION_SET", showNotification })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Layout);
