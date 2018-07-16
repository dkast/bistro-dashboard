import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "next/link";

import { PageWithAuthorization } from "../components/app";
import { auth } from "../firebase";
import Head from "../components/head";
import Layout from "../components/layout";

class Page extends Component {
  render() {
    const { authUser } = this.props;
    return (
      <>
        <Head title="Home" />
        <PageWithAuthorization>
          {authUser && <Dashboard {...this.props} />}
        </PageWithAuthorization>
      </>
    );
  }
}

const Dashboard = props => (
  <Layout>
    <h1>Home</h1>
    <button className="btn btn-primary" onClick={auth.doSignOut}>
      Sign Out
    </button>
  </Layout>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Page);
