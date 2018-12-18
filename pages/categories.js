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

const ACT_ADD = "add";
const ACT_UPDATE = "update";

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
  selectedRowInfo: null,
  isOpenCategoryModal: false,
  isOpenDeleteModal: false,
  categoryName: "",
  error: null,
  dbAction: null
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

  handleShowAddModal = event => {
    this.setState({ isOpenCategoryModal: true, dbAction: ACT_ADD });
    event.preventDefault();
  };

  handleShowUpdateModal = (rowInfo, event) => {
    this.setState({
      isOpenCategoryModal: true,
      dbAction: ACT_UPDATE,
      selectedRowInfo: rowInfo
    });
    event.preventDefault();
  };

  handleDismissCategoryModal = event => {
    this.setState({ isOpenCategoryModal: false });
    event.preventDefault();
  };

  handleDismissDeleteModal = event => {
    this.setState({ isOpenDeleteModal: false });
    event.preventDefault();
  };

  handlePromptDeleteModal = (rowInfo, event) => {
    this.setState({ isOpenDeleteModal: true, selectedRowInfo: rowInfo });
    event.preventDefault();
  };

  handleUpsertCategory = categoryName => {
    const { notification } = this.props;
    const { dbAction, selectedRowInfo } = this.state;
    let notificationTitle;

    switch (dbAction) {
      case ACT_ADD:
        notificationTitle = "Categoria Creada";
        this.props.firestore
          .add("categories", { categoryName, owner: this.props.authUser.uid })
          .then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.onSetNotification({
              ...notification,
              visible: true,
              title: notificationTitle,
              message: "Los cambios han sido guardados",
              type: "success"
            });
          })
          .catch(error => {
            this.setState({ error });
            this.props.onSetNotification({
              visible: true,
              title: "Ha ocurrido un error",
              message: "Por favor intentelo mas tarde",
              type: "danger"
            });
          });
        break;
      case ACT_UPDATE:
        notificationTitle = "Categoria Modificada";
        const categoryUpdates = {
          categoryName: categoryName,
          updatedAt: this.props.firestore.FieldValue.serverTimestamp()
        };
        this.props.firestore
          .update(
            { collection: "categories", doc: selectedRowInfo.original.id },
            categoryUpdates
          )
          .then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.onSetNotification({
              ...notification,
              visible: true,
              title: notificationTitle,
              message: "Los cambios han sido guardados",
              type: "success"
            });
          })
          .catch(error => {
            this.setState({ error });
            this.props.onSetNotification({
              visible: true,
              title: "Ha ocurrido un error",
              message: "Por favor intentelo mas tarde",
              type: "danger"
            });
          });
      default:
        break;
    }
  };

  handleDeleteCategory = event => {
    const id = this.state.selectedRowInfo.original.id;
    this.props.firestore
      .delete({ collection: "categories", doc: id })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.onSetNotification({
          title: "Categoria Eliminada",
          message: "Categoria ha sido eliminada",
          type: "success",
          visible: true
        });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    const { categories } = this.props;
    const { selectedRowInfo } = this.state;
    let title, message, defaultValue, keyId;

    if (selectedRowInfo) {
      title = `Eliminar categoria ${selectedRowInfo.original.categoryName}`;
      message = `¿Desea eliminar la categoria ${
        selectedRowInfo.original.categoryName
      }? Esta operación no puede deshacerse.`;
      defaultValue = selectedRowInfo.original.categoryName;
      keyId = selectedRowInfo.original.id;
    }

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
            <a
              className="icon mr-3"
              onClick={e => this.handleShowUpdateModal(row, e)}
            >
              <i className="fe fe-edit" />
            </a>
            <a
              className="icon mr-3"
              onClick={e => this.handlePromptDeleteModal(row, e)}
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
        <ModalConfirmation
          title={title}
          message={message}
          isOpen={this.state.isOpenDeleteModal}
          onConfirm={this.handleDeleteCategory}
          onDismiss={this.handleDismissDeleteModal}
        />
        {/* Use key to create a new instance of the component instead of update
        the current one
        https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key*/}
        <ModalForm
          isOpen={this.state.isOpenCategoryModal}
          onConfirm={this.handleUpsertCategory}
          onDismiss={this.handleDismissCategoryModal}
          dbAction={this.state.dbAction}
          defaultValue={defaultValue}
          key={keyId}
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
                                className="btn btn-primary"
                                onClick={this.handleShowAddModal}
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
                        <EmptyState onAction={this.handleShowAddModal} />
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

const ModalConfirmation = props => (
  <Modal visible={props.isOpen}>
    <div className="modal-header">
      <h5 className="modal-title">{props.title}</h5>
      <button
        className="close"
        type="button"
        aria-label="Close"
        onClick={props.onDismiss}
      />
    </div>
    <div className="modal-body">
      <p>{props.message}</p>
    </div>
    <div className="modal-footer">
      <button className="btn btn-secondary" onClick={props.onDismiss}>
        Cancelar
      </button>
      <button className="btn btn-danger" onClick={props.onConfirm}>
        Eliminar
      </button>
    </div>
  </Modal>
);

class ModalForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryName: props.defaultValue,
      error: null
    };
  }

  render() {
    const { error, categoryName } = this.state;
    const { isOpen, onDismiss, onConfirm, dbAction, defaultValue } = this.props;
    let title;

    switch (dbAction) {
      case ACT_ADD:
        title = "Crear Categoria";
        break;
      case ACT_UPDATE:
        title = `Renombrar Categoria ${defaultValue}`;
        break;
      default:
        break;
    }

    return (
      <Modal visible={isOpen}>
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
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
            className="btn btn-primary"
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
      <button className="btn btn-primary btn-lg" onClick={props.onAction}>
        Crear una Categoria
      </button>
    </div>
  </div>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  categories: state.firestoreState.ordered.categories
});

const mapDispatchToProps = dispatch => ({
  onSetNotification: notification =>
    dispatch({ type: "NOTIFICATION_SET", notification })
});

export default withPageProps(
  withFirestore(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Page)
  )
);
