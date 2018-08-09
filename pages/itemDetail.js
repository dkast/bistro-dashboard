import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

import { PageWithAuthorization } from "../components/app";
import SheetView from "../components/ui/sheetView";
import Layout from "../components/layout";
import { withFirestore, withPageProps } from "../utils";

class Page extends Component {
  render() {
    const { authUser } = this.props;
    return (
      <>
        <PageWithAuthorization>
          {authUser && <EnhancedItemDetailPage {...this.props} />}
        </PageWithAuthorization>
      </>
    );
  }
}

class ItemDetailPage extends Component {
  render() {
    const { values, errors, touched, handleChange, isSubmitting } = this.props;
    return (
      <Layout>
        <Form className="form-sheet">
          <SheetView
            title={"Crear Nuevo Item"}
            routeBack={"items"}
            content={<ItemForm {...this.props} />}
            footer={
              <button
                className="btn btn-azure"
                type="submit"
                disabled={isSubmitting}
              >
                Guardar
              </button>
            }
          />
        </Form>
        <style jsx global>
          {`
            .form-sheet {
              height: 100%;
            }
          `}
        </style>
      </Layout>
    );
  }
}

const EnhancedItemDetailPage = withFormik({
  mapPropsToValues: props => ({ name }) => ({
    name: name || ""
  }),
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Nombre es requerido")
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      props.firestore.add("items", {
        ...values,
        owner: props.authUser.uid
      });
      setSubmitting(false);
    }, 1000);
  },
  displayName: "ItemForm"
})(ItemDetailPage);

class ItemForm extends Component {
  state = {};
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
        <div className="col-sm-8">
          <div className="form-row py-5 border-bottom">
            <div className="col-sm-4">
              <h4>Detalle</h4>
            </div>
            <div className="col-sm-8">
              <div className="form-group">
                <label className="form-label">Nombre del Producto</label>
                <Field
                  type="text"
                  name="name"
                  className={
                    errors.name && touched.name
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  placeholder={"Nombre del Producto"}
                />
                {touched.name &&
                  errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
              </div>
              <div className="form-group">
                <label className="form-label">Descripcion</label>
                <Field
                  component="textarea"
                  name="description"
                  className="form-control"
                  placeholder="Capture una descripcion a este Item"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="form-row py-5 border-bottom">
            <div className="col-sm-4">
              <h4>Precio y Datos de Inventario</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
  items: state.firestoreState.ordered.items
});

export default withPageProps(withFirestore(connect(mapStateToProps)(Page)));
