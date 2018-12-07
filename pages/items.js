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

  render() {
    const { items } = this.props;
    const columns = [
      {
        Header: "Producto",
        accessor: "name"
      },
      {
        Header: "Categoria",
        accessor: "category"
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
    let isLoading = false;

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
                      <div className="toolbar mt-5 mb-2">
                        <div className="form-inline d-flex justify-content-between">
                          <input type="text" className="form-control" />
                          <Link route="item-detail" params={{ id: "new" }}>
                            <a className="btn btn-azure">Crear Item</a>
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
                </div>
              </div>
            </div>
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

export default withPageProps(withFirestore(connect(mapStateToProps)(Page)));
