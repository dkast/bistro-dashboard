import React, { Component } from "react";
import { connect } from "react-redux";

import { PageWithAuthorization } from "../components/app";
import Layout from "../components/layout";
import PageHeader from "../components/layout/pageHeader";

class Page extends Component {
  render() {
    const { authUser } = this.props;
    return (
      <>
        <PageWithAuthorization>
          {authUser && <Dashboard {...this.props} />}
        </PageWithAuthorization>
      </>
    );
  }
}

const Dashboard = props => (
  <Layout>
    <PageHeader title="Bienvenido a Bistro!" />
  </Layout>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Page);
