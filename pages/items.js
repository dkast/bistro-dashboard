import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { PageWithAuthorization } from "../components/app";
import Head from "../components/head";
import Layout from "../components/layout";
import ItemsNavigation from "../components/navigation/itemsNavigation";
import withFirestore from "../utils";
import SimpleTable from "../components/datatables/simpleTable";

const listenerSettings = {
  collection: "items"
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
    const { items } = this.props;
    const columns = [
      {
        Header: "Product",
        accessor: "product"
      },
      {
        Header: "Category",
        accessor: "category"
      },
      {
        Header: "Price",
        accessor: "price"
      }
    ];
    let isLoading = false;

    return (
      <Layout>
        <div className="row">
          <div className="col m-5">
            <h3>Items</h3>
            <ItemsNavigation />
            <div className="toolbar mt-5 mb-2">
              <div className="form-inline d-flex justify-content-between">
                <input type="text" className="form-control" />
                <button className="btn btn-azure">Add Item</button>
              </div>
            </div>
            <SimpleTable data={items} columns={columns} />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  users: state.firestoreState.ordered.items
});

export default withFirestore(connect(mapStateToProps)(Page));
