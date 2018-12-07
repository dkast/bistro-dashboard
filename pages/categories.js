import React, { Component } from "react";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";

import { PageWithAuthorization } from "../components/app";
import Layout from "../components/layout";
import ItemsNavigation from "../components/navigation/itemsNavigation";
import { withFirestore, withPageProps } from "../utils";
import SimpleTable from "../components/datatable/simpleTable";
import { Link, Router } from "../routes";
import PageHeader from "../components/layout/pageHeader";

const listenerSettings = {
  collection: "categories"
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
        {authUser && <CategoriesPage {...this.props} />}
      </PageWithAuthorization>
    );
  }
}

class CategoriesPage extends Component {
  handleRowClick = rowInfo => {
    console.log(rowInfo);
    Router.pushRoute("item-detail", { id: rowInfo.original.id });
  };

  render() {
    const { categories } = this.props;
    const columns = [
      {
        Header: "Categoria",
        accessor: "name"
      }
    ];

    let hasRecords = false;

    if (categories) {
      if (categories.length > 0) {
        hasRecords = true;
      }
    }

    return (
      <Layout>
        <div className="page">
          <div className="page-main">
            <PageHeader title="Items" />
            <div className="container-fluid mt-5">
              <div className="row">
                <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <ItemsNavigation />
                      {hasRecords ? (
                        <>
                          <div className="toolbar mt-5 mb-2">
                            <div className="form-inline d-flex justify-content-between">
                              <input type="text" className="form-control" />
                              <button className="btn btn-azure">
                                Agregar Categoria
                              </button>
                            </div>
                          </div>
                          <SimpleTable
                            data={categories}
                            columns={columns}
                            onRowClick={this.handleRowClick}
                          />
                        </>
                      ) : (
                        <EmptyState />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const EmptyState = () => (
  <div className="border p-5 text-center">
    <h2>No hay nada :(</h2>
  </div>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  categories: state.firestoreState.ordered.categories
});

export default withPageProps(withFirestore(connect(mapStateToProps)(Page)));
