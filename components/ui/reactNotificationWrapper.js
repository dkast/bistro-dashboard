import React, { Component } from "react";
import { connect } from "react-redux";
import ReactNotification from "react-notifications-component";

class NotificationWrapper extends Component {
  addNotification = notification => {
    this.notificationDOMRef.addNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      insert: "top",
      container: "top-right",
      animationIn: ["animated", "flipInX"],
      animationOut: ["animated", "fadeOut"],
      dismiss: { duration: 5000 },
      dismissable: { click: true }
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.notification !== prevProps.notification) {
      if (this.props.notification && this.props.notification.visible === true) {
        const notification = this.props.notification;
        this.addNotification(notification);
        this.props.onSetNotification({
          ...notification,
          visible: false
        });
      }
    }
  }

  render() {
    return (
      <ReactNotification ref={input => (this.notificationDOMRef = input)} />
    );
  }
}

const mapStateToProps = state => ({
  notification: state.uiState.notification
});

const mapDispatchToProps = dispatch => ({
  onSetNotification: notification =>
    dispatch({ type: "NOTIFICATION_SET", notification })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationWrapper);
