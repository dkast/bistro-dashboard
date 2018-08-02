import React from "react";
import { compose } from "recompose";
import withAuthentication from "../session/withAuthentication";
import withAuthorization from "../session/withAuthorization";

const Page = ({ children }) => (
  <div {...this.props} className="app">
    {children}
  </div>
);

const PageWithAuthentication = compose(
  withAuthentication,
  withAuthorization(false)
)(Page);

const PageWithAuthorization = compose(
  withAuthentication,
  withAuthorization(true)
)(Page);

export { PageWithAuthentication, PageWithAuthorization };
