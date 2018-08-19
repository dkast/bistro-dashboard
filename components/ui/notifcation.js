import React, { Component } from "react";
import dynamic from "next/dynamic";
import "react-notifications-component/dist/theme.css";
import "animate.css";

const DynamicReactNotification = dynamic(import("./reactNotificationWrapper"), {
  ssr: false,
  loading: () => ""
});

class Notification extends Component {
  render() {
    const { children } = this.props;
    return (
      <>
        <DynamicReactNotification />
        {children}
      </>
    );
  }
}

export default Notification;
