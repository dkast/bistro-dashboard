import React, { Component } from "react";
import { connect } from "react-redux";
// import Link from "next/link";

import { PageWithAuthorization } from "../components/app";
import { auth } from "../firebase";
import Head from "../components/head";
import Layout from "../components/layout";

class Page extends Component {
  render() {
    const { authUser } = this.props;
    return (
      <>
        <Head title="Items" />
        <PageWithAuthorization>
          {authUser && <ItemsPage {...this.props} />}
        </PageWithAuthorization>
      </>
    );
  }
}

const ItemsPage = props => (
  <Layout>
    <div className="row">
      <div className="col p-5">
        <h3>Items</h3>
      </div>
    </div>
  </Layout>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Page);
