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

  handleCreateItem = event => {
    event.preventDefault();
    Router.pushRoute("item-detail", { id: "new" });
  };

  render() {
    const { items } = this.props;
    const columns = [
      {
        Header: "Producto",
        accessor: "name"
      },
      {
        Header: "Categoria",
        accessor: "category.categoryName"
      },
      {
        Header: "Precio",
        accessor: "price",
        Cell: row => (
          <NumberFormat
            value={row.value}
            prefix={"$"}
            thousandSeparator={true}
            decimalScale={2}
            fixedDecimalScale={true}
            displayType={"text"}
          />
        )
      }
    ];

    let hasRecords = false;

    if (items) {
      if (items.length > 0) {
        hasRecords = true;
      }
    }

    return (
      <Layout>
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
                          <button
                            className="btn btn-primary"
                            onClick={this.handleCreateItem}
                          >
                            Crear Item
                          </button>
                        </div>
                      </div>
                      <SimpleTable
                        data={items}
                        columns={columns}
                        onRowClick={this.handleRowClick}
                      />
                    </>
                  ) : (
                    <EmptyState onAction={this.handleCreateItem} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const EmptyState = props => (
  <div className="row justify-content-center my-4 p-5 text-center">
    <div className="col-md-8">
      <i
        className="fe fe-grid text-gray"
        style={{ fontSize: "3.75em", verticalAlign: "middle" }}
      />
      <h3 className="mt-5">No hay Items</h3>
      <p className="lead my-5 text-muted">
        Inicie creando un Item para añadir a su menu y asi sus clientes puedan
        realizar sus pedidos.
      </p>
      <button className="btn btn-primary btn-lg" onClick={props.onAction}>
        Crear un Item
      </button>
    </div>
  </div>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  items: state.firestoreState.ordered.items
});

export default withPageProps(withFirestore(connect(mapStateToProps)(Page)));
