import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Field, withFormik, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "react-bootstrap4-modal";
import NumberFormat from "react-number-format";

import { parseNumber } from "../utils";
import { PageWithAuthorization } from "../components/app";
import SheetView from "../components/layout/sheetView";
import Layout from "../components/layout";
import { withFirestore, withPageProps } from "../utils";
import Loader from "../components/ui/loader";
import { Router } from "../routes";
import UploadImage from "../components/ui/uploadImage";
import { firebase } from "../firebase";

const ACT_ADD = "add";
const ACT_UPDATE = "update";

class Page extends Component {
  loadData = () => {
    const id = this.props.query.id;
    this.props.firestore.get({ collection: "items", doc: id });
  };

  componentDidMount() {
    this.loadData();
  }
  render() {
    const { authUser, items, query } = this.props;
    let item = "";
    let action;

    if (query.id === "new") {
      action = ACT_ADD;
    } else {
      action = ACT_UPDATE;
    }

    if (!items) return <Loader />;

    if (items.length) {
      item = items[0];
    }

    return (
      <>
        <PageWithAuthorization>
          {authUser && (
            <EnhancedItemDetailPage
              {...this.props}
              item={item}
              dbAction={action}
            />
          )}
        </PageWithAuthorization>
      </>
    );
  }
}

class ItemDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  onShowConfirmDelete = event => {
    event.preventDefault();
    this.setState({ open: true });
  };

  onDismissConfirmDelete = event => {
    event.preventDefault();
    this.setState({ open: false });
  };

  onDeleteItem = event => {
    event.preventDefault();
    const id = this.props.query.id;
    //Delete related media
    if (this.props.item.filename) {
      firebase.storage
        .ref("images")
        .child(this.props.item.filename)
        .delete();
    }
    this.props.firestore.delete({ collection: "items", doc: id });
    this.setState({ open: false });
    this.props.onSetNotification({
      title: "Item Eliminado",
      message: "Item ha sido eliminado",
      type: "success",
      visible: true
    });
    setTimeout(() => {
      Router.pushRoute("items");
    }, 500);
  };

  renderFooter = (action, isSubmitting) => {
    switch (action) {
      case ACT_ADD:
        return (
          <button
            className="btn btn-azure"
            type="submit"
            disabled={isSubmitting}
          >
            Guardar
          </button>
        );
      case ACT_UPDATE:
        return (
          <>
            <button
              className="btn btn-outline-danger mr-2"
              onClick={this.onShowConfirmDelete}
            >
              Eliminar
            </button>
            <button
              className="btn btn-azure"
              type="submit"
              disabled={isSubmitting}
            >
              Guardar
            </button>
          </>
        );
    }
  };

  render() {
    const {
      values,
      errors,
      touched,
      handleChange,
      isSubmitting,
      dbAction
    } = this.props;
    const title = dbAction === ACT_ADD ? "Crear Nuevo Item" : "Actualiza Item";
    return (
      <Layout>
        <ModalConfirmation
          open={this.state.open}
          onConfirm={this.onDeleteItem}
          onDismiss={this.onDismissConfirmDelete}
        />
        <Form className="form-sheet">
          <SheetView
            title={title}
            routeBack={"items"}
            content={<ItemForm {...this.props} />}
            footer={this.renderFooter(dbAction, isSubmitting)}
          />
        </Form>
        <style jsx global>{`
          .form-sheet {
            height: 100%;
          }
        `}</style>
      </Layout>
    );
  }
}

const EnhancedItemDetailPage = withFormik({
  enableReinitialize: false,
  mapPropsToValues: props => {
    return props.item;
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Nombre es requerido"),
    price: Yup.number().required("Precio es requerido")
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    //alert(JSON.stringify(values, null, 2));
    console.dir(props.touched);
    let notificationTitle = "";
    switch (props.dbAction) {
      case ACT_ADD:
        props.firestore.add("items", {
          ...values,
          owner: props.authUser.uid
        });
        notificationTitle = "Item Creado";
        break;
      case ACT_UPDATE:
        //Substract id from values to avoid duplicate property on firebase document
        let { id, price, ...valuesNoId } = values;
        price = parseNumber(price);
        const itemUpdates = {
          ...valuesNoId,
          price: price,
          updatedAt: props.firestore.FieldValue.serverTimestamp()
        };
        props.firestore.update({ collection: "items", doc: id }, itemUpdates);
        notificationTitle = "Item Modificado";
        break;
    }
    //setSubmitting(false);
    props.onSetNotification({
      ...props.notification,
      visible: true,
      title: notificationTitle,
      message: "Los cambios han sido guardados",
      type: "success"
    });
    Router.pushRoute("items");
  },
  displayName: "ItemForm"
})(ItemDetailPage);

class ItemForm extends Component {
  state = {};

  handleImageURL = (imageURL, filename) => {
    const { values, setValues, dbAction } = this.props;
    setValues({ ...values, imageURL, filename });

    //Save changes to keep relation between firestore record and bucket storage
    switch (dbAction) {
      case ACT_ADD:
        if (!values.name) {
          setValues({ ...values, name: "Sin Titulo" });
        }
        this.props.firestore.add("items", {
          ...values,
          imageURL,
          filename,
          owner: this.props.authUser.uid
        });
        break;
      case ACT_UPDATE:
        let { id, ...valuesNoId } = values;
        const itemUpdates = {
          ...valuesNoId,
          imageURL,
          filename,
          updatedAt: this.props.firestore.FieldValue.serverTimestamp()
        };
        this.props.firestore.update(
          { collection: "items", doc: id },
          itemUpdates
        );
        break;

      default:
        break;
    }
  };

  render() {
    const {
      values,
      touched,
      errors,
      dirty,
      isSubmitting,
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset
    } = this.props;
    return (
      <div className="row d-flex justify-content-center mt-4">
        <div className="col-lg-10 col-xl-8">
          <h4 className="py-4">Detalle</h4>
          <div className="form-row border-bottom">
            <div className="col-md-12 col-lg-7">
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label className="form-label">Nombre del Producto</label>
                  <Field
                    type="text"
                    name="name"
                    className={
                      errors.name && touched.name
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    placeholder="Nombre del Producto"
                  />
                  {touched.name &&
                    errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                </div>
                <div className="form-group col-md-12">
                  <label className="form-label">Descripcion</label>
                  <Field
                    component="textarea"
                    name="description"
                    className="form-control"
                    placeholder="Capture una descripcion a este Item"
                    rows="3"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label className="form-label">Precio</label>
                  <Field
                    name="price"
                    render={({ field }) => (
                      <NumberFormat
                        {...field}
                        thousandSeparator={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        className={
                          errors.price && touched.price
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder="0.00"
                      />
                    )}
                  />
                  {touched.price &&
                    errors.price && (
                      <div className="invalid-feedback">{errors.price}</div>
                    )}
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-5 d-flex justify-content-lg-end">
              <div className="form-group">
                <label className="form-label">Añadir Imagen</label>
                <UploadImage
                  onChangeImageURL={this.handleImageURL}
                  imageURL={values.imageURL}
                  filename={values.filename}
                />
              </div>
            </div>
          </div>
          <div className="form-row py-5 border-bottom">
            <div className="col-sm-4">
              <h4>Inventario</h4>
            </div>
            <div className="form-row col-sm-8" />
          </div>
        </div>
      </div>
    );
  }
}

class ModalConfirmation extends Component {
  render() {
    return (
      <Modal visible={this.props.open}>
        <div className="modal-header">
          <h5 className="modal-title">Eliminar Item</h5>
          <button
            className="close"
            type="button"
            aria-label="Close"
            onClick={this.props.onDismiss}
          />
        </div>
        <div className="modal-body">
          <p>¿Desea eliminar este Item? Esta operación no puede deshacerse.</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={this.props.onDismiss}>
            Cancelar
          </button>
          <button className="btn btn-danger" onClick={this.props.onConfirm}>
            Eliminar
          </button>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  authUser: state.sessionState.authUser,
  items: state.firestoreState.ordered.items,
  notification: state.uiState.notification
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
