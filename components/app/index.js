import React from "react";
import { compose } from "recompose";
import withAuthentication from "../session/withAuthentication";
import withAuthorization from "../session/withAuthorization";

const App = ({ children }) => (
  <div {...this.props} className="app">
    {children}
  </div>
);

const PageWithAuthentication = compose(
  withAuthentication,
  withAuthorization(false)
)(App);

const PageWithAuthorization = compose(
  withAuthentication,
  withAuthorization(true)
)(App);

export { PageWithAuthentication, PageWithAuthorization };
