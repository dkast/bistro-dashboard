import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Field, withFormik, ErrorMessage, Formik } from "formik";
import * as Yup from "yup";
import Modal from "react-bootstrap4-modal";
import NumberFormat from "react-number-format";
import Select from "react-select";

import { parseNumber } from "../utils";
import { PageWithAuthorization } from "../components/app";
import SheetView from "../components/layout/sheetView";
import Layout from "../components/layout";
import { withFirestore, withPageProps } from "../utils";
import Loader from "../components/ui/loader";
import { Router } from "../routes";
import UploadImage from "../components/ui/uploadImage";
import { firebase } from "../firebase";

Router.events.on("routeChangeStart", url => {
  //throw new Error("Changes not saved");
  console.log(url);
});

const ACT_ADD = "add";
const ACT_UPDATE = "update";

class Page extends Component {
  constructor(props) {
    super(props);
  }

  loadData = () => {
    const id = this.props.query.id;
    this.props.firestore.get({ collection: "items", doc: id });
    this.props.firestore.get({ collection: "categories" });
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
      item = items.find(obj => {
        return obj.id === query.id;
      });

      // If nothing was found
      if (!item) {
        item = "";
      }
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
      openDeleteModal: false
    };
  }

  handleShowDeleteModal = event => {
    this.setState({ openDeleteModal: true });
    event.preventDefault();
  };

  handleDismissDeleteModal = event => {
    this.setState({ openDeleteModal: false });
    event.preventDefault();
  };

  handleDeleteItem = event => {
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
    this.setState({ openDeleteModal: false });
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

  renderActionButtons = (action, isSubmitting) => {
    switch (action) {
      case ACT_ADD:
        return (
          <button
            className="btn btn-primary"
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
              onClick={this.handleShowDeleteModal}
            >
              Eliminar
            </button>
            <button
              className="btn btn-primary"
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
          isOpen={this.state.openDeleteModal}
          onConfirm={this.handleDeleteItem}
          onDismiss={this.handleDismissDeleteModal}
        />
        <Form className="form-sheet">
          <SheetView
            title={title}
            routeBack={"items"}
            content={<ItemForm {...this.props} />}
            footer={this.renderActionButtons(dbAction, isSubmitting)}
          />
        </Form>
        <style jsx global>{`
          .form-sheet {
            min-height: 100vh;
          }
        `}</style>
      </Layout>
    );
  }
}

const EnhancedItemDetailPage = withFormik({
  enableReinitialize: true,
  validateOnBlur: false,
  validateOnChange: false,
  mapPropsToValues: props => {
    return {
      id: props.item.id || "",
      name: props.item.name || "",
      description: props.item.description || "",
      price: props.item.price || "",
      filename: props.item.filename || "",
      imageURL: props.item.imageURL || "",
      category: props.item.category,
      isActive: props.item.isActive
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Nombre es requerido"),
    price: Yup.number().required("Precio es requerido"),
    category: Yup.object({
      categoryName: Yup.string().required("Seleccione una categoria"),
      id: Yup.string().required(),
      owner: Yup.string().required()
    })
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    //alert(JSON.stringify(values, null, 2));
    console.dir(props);
    console.dir(values);

    let notificationTitle = "";
    //Substract id from values to avoid duplicate property on firebase document
    let { id, price, isActive, ...valuesNoId } = values;
    price = parseNumber(price);
    if (isActive === undefined) {
      isActive = false;
    }

    switch (props.dbAction) {
      case ACT_ADD:
        props.firestore.add("items", {
          ...valuesNoId,
          price: price,
          isActive: isActive,
          owner: props.authUser.uid
        });
        notificationTitle = "Item Creado";
        break;
      case ACT_UPDATE:
        const itemUpdates = {
          ...valuesNoId,
          price: price,
          isActive: isActive,
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
  constructor(props) {
    super(props);
  }

  handleImageURL = (imageURL, filename) => {
    const { values, setValues, dbAction } = this.props;
    setValues({ ...values, imageURL, filename });

    //Save changes to keep relation between firestore record and bucket storage
    switch (dbAction) {
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
      handleReset,
      setFieldValue,
      setFieldTouched
    } = this.props;

    let options;
    let isOptionsLoading = false;
    if (!this.props.categories) {
      isOptionsLoading = true;
    } else {
      isOptionsLoading = false;
      options = this.props.categories;
    }

    return (
      <div className="row d-flex justify-content-center mt-4">
        <div className="col-lg-10 col-xl-8">
          <h4 className="py-4 border-bottom">Detalle</h4>
          <div className="form-row">
            <div className="col-md-12 col-lg-7">
              <div className="form-row">
                <div className="form-group col-md-12">
                  <label className="form-label">Nombre del Producto</label>
                  <Field
                    type="text"
                    name="name"
                    className={
                      errors.name ? "form-control is-invalid" : "form-control"
                    }
                    placeholder="Nombre del Producto"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>
                <div className="form-group col-md-12">
                  <label className="form-label">Categoria</label>
                  <CategorySelect
                    value={values.category}
                    options={options}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    className={errors.category ? "is-invalid" : ""}
                  />
                  {errors.category && (
                    <div className="invalid-feedback d-block">
                      {errors.category.categoryName}
                    </div>
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
                          errors.price
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        placeholder="0.00"
                      />
                    )}
                  />
                  {errors.price && (
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

          <h4 className="pt-4 pb-2">Punto de Venta</h4>
          <div className="form-row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <h4>Item disponible para ordenar</h4>
                      <small className="text-muted">
                        Indica si el item esta activo para ordenar a traves de
                        su aplicacion, de no ser asi el item no aparece en su
                        menu.
                      </small>
                    </div>
                    <div className="col-auto align-self-center">
                      <label className="custom-switch m-0">
                        <Field
                          name="isActive"
                          type="checkbox"
                          className="fcustom-switch-input"
                          checked={values.isActive}
                          className="custom-switch-input"
                        />
                        <span className="custom-switch-indicator" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ModalConfirmation = props => (
  <Modal visible={props.isOpen}>
    <div className="modal-header">
      <h5 className="modal-title">Eliminar Item</h5>
      <button
        className="close"
        type="button"
        aria-label="Close"
        onClick={props.onDismiss}
      />
    </div>
    <div className="modal-body">
      <p>¿Desea eliminar este Item? Esta operación no puede deshacerse.</p>
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

class CategorySelect extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = value => {
    // This is going to call setFeildValue
    this.props.onChange("category", value);
  };

  handleBlur = () => {
    // This is going to call setFieldTouched
    this.props.onBlur("category", true);
  };

  render() {
    if (!this.props.options) {
      return <Select isDisabled />;
    } else {
      return (
        <Select
          className={this.props.className}
          options={this.props.options}
          getOptionValue={option => option.id}
          getOptionLabel={option => option.categoryName}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={this.props.value}
          placeholder="Seleccionar..."
          isClearable
        />
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  authUser: state.sessionState.authUser,
  items: state.firestoreState.ordered.items,
  categories: state.firestoreState.ordered.categories,
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
