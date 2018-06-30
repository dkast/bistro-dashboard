import React from "react";
import Router from "next/router";
import { firebase } from "../../firebase";

const withAuthorization = needsAuthorization => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!authUser && needsAuthorization) {
          Router.push("/signin");
        }
      });
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return WithAuthorization;
};

export default withAuthorization;
