import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTable from "react-table";
import PropTypes from "prop-types";

import { PageWithAuthorization } from "../components/app";
import Head from "../components/head";
import Layout from "../components/layout";
import ItemsNavigation from "../components/navigation/itemsNavigation";
import withFirestore from "../utils";

const listenerSettings = {
  collection: "users"
};

class Page extends Component {
  loadData = () => {
    this.props.firestore.setListener(listenerSettings);
  };

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
    this.props.firestore.unsetListener(listenerSettings);
  }

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

class ItemsPage extends Component {
  render() {
    const { users } = this.props;
    const columns = [
      {
        Header: "username",
        accessor: "username"
      },
      {
        Header: "email",
        accessor: "email"
      }
    ];
    console.log("users", users);
    return (
      <Layout>
        <div className="row">
          <div className="col m-5">
            <h3>Items</h3>
            <ItemsNavigation />
            <div className="toolbar my-2">
              <div className="form-inline d-flex justify-content-between">
                <input type="text" className="form-control" />
                <button className="btn btn-azure">Add Item</button>
              </div>
            </div>
            <div>
              {users !== undefined ? (
                <ReactTable data={users} columns={columns} />
              ) : null}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  users: state.firestoreState.ordered.users
});

export default withFirestore(connect(mapStateToProps)(Page));
