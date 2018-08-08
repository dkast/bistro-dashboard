import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { PageWithAuthorization } from "../components/app";
import Head from "../components/head";
import Layout from "../components/layout";
import ItemsNavigation from "../components/navigation/itemsNavigation";
import withFirestore from "../utils";
import SimpleTable from "../components/datatable/simpleTable";
import { Link, Router } from "../routes";

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
      <PageWithAuthorization>
        {authUser && <ItemsPage {...this.props} />}
      </PageWithAuthorization>
    );
  }
}

class ItemsPage extends Component {
  handleRowClick = rowInfo => {
    console.log(rowInfo);
    Router.pushRoute("item-detail", { id: rowInfo.original.id });
  };

  render() {
    const { items } = this.props;
    const columns = [
      {
        Header: "Product",
        accessor: "name"
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
                {/* <button className="btn btn-azure">Add Item</button> */}
                <Link route="item-detail" params={{ id: "new" }}>
                  <a className="btn btn-azure">Create Item</a>
                </Link>
              </div>
            </div>
            <SimpleTable
              data={items}
              columns={columns}
              onRowClick={this.handleRowClick}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  items: state.firestoreState.ordered.items
});

export default withFirestore(connect(mapStateToProps)(Page));
