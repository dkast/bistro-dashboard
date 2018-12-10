import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-bootstrap4-modal";

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

const INITIAL_STATE = {
  isOpenCategoryModal: false,
  categoryName: "",
  error: null
};

class CategoriesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }

  handleRowClick = rowInfo => {
    console.log(rowInfo);
  };

  handleShowCategoryModal = event => {
    this.setState({ isOpenCategoryModal: true });
    event.preventDefault();
  };

  handleDismissCategoryModal = event => {
    this.setState({ isOpenCategoryModal: false });
    event.preventDefault();
  };

  handleCreateCategory = categoryName => {
    console.log(categoryName);
    this.props.firestore
      .add("categories", { categoryName, owner: this.props.authUser.uid })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  handleDeleteCategory = categoryId => {
    alert(categoryId);
  };

  render() {
    const { categories } = this.props;
    const columns = [
      {
        Header: "Categoria",
        accessor: "categoryName"
      },
      {
        Header: "",
        accessor: "id",
        Cell: row => (
          <div className="d-flex justify-content-end">
            <a className="icon mr-3" href="#">
              <i className="fe fe-edit" />
            </a>
            <a
              className="icon mr-3"
              onClick={() => this.handleDeleteCategory(row.value)}
            >
              <i className="fe fe-trash" />
            </a>
          </div>
        )
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
        <ModalForm
          isOpen={this.state.isOpenCategoryModal}
          onConfirm={this.handleCreateCategory}
          onDismiss={this.handleDismissCategoryModal}
        />
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
                              <button
                                className="btn btn-azure"
                                onClick={this.handleShowCategoryModal}
                              >
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
                        <EmptyState onAction={this.handleShowCategoryModal} />
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

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: "",
      error: null
    };
  }
  render() {
    const { error, categoryName } = this.state;
    const { isOpen, onDismiss, onConfirm } = this.props;
    return (
      <Modal visible={isOpen}>
        <div className="modal-header">
          <h5 className="modal-title">Crear Categoria</h5>
          <button
            className="close"
            type="button"
            aria-label="Close"
            onClick={onDismiss}
          />
        </div>
        <div className="modal-body">
          <div className="form">
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Categoria</span>
              </div>
              <input
                type="text"
                className={"form-control " + (error ? "is-invalid" : "")}
                value={categoryName}
                onChange={event =>
                  this.setState({
                    categoryName: event.target.value
                  })
                }
                placeholder="Categoria"
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onDismiss}>
            Cancelar
          </button>
          <button
            className="btn btn-azure"
            onClick={() => onConfirm(this.state.categoryName)}
          >
            Guardar
          </button>
        </div>
      </Modal>
    );
  }
}

const EmptyState = props => (
  <div className="row justify-content-center my-4 p-5 text-center">
    <div className="col-md-8">
      <i
        className="fe fe-layers text-gray"
        style={{ fontSize: "3.75em", verticalAlign: "middle" }}
      />
      <h3 className="mt-5">No hay Categorias</h3>
      <p className="lead my-5 text-muted">
        Las categorias le ayudan a organizar su menu y presentar de una mejor
        manera sus items a sus clientes al momento de ordenar.
      </p>
      <button className="btn btn-azure btn-lg" onClick={props.onAction}>
        Crear una Categoria
      </button>
    </div>
  </div>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  categories: state.firestoreState.ordered.categories
});

export default withPageProps(withFirestore(connect(mapStateToProps)(Page)));
