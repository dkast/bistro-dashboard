import React, { Component } from "react";
import { connect } from "react-redux";

import { PageWithAuthorization } from "../components/app";
import { auth } from "../firebase";
import Head from "../components/head";
import Layout from "../components/layout";
import ItemsNavigation from "../components/navigation/itemsNavigation";

class Page extends Component {
  // static async getInitialProps({ store, isServer, pathname, query }) {
  //   console.log(isServer);
  //   console.log(pathname);
  //   store.dispatch({
  //     type: "SIDEBAR_SELECTED_SET",
  //     routeSelected: pathname
  //   });
  // }

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
      <div className="col m-5">
        <h3>Items</h3>
        <ItemsNavigation />
      </div>
    </div>
  </Layout>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Page);
