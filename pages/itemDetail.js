import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

import { PageWithAuthorization } from "../components/app";
import Layout from "../components/layout";
import { Link } from "../routes";

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
  mapPropsToValues: ({ name }) => ({
    name: name || ""
  }),
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Nombre es requerido")
  }),
  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: "ItemForm"
})(ItemDetailPage);

class ItemForm extends Component {
  state = {};
  render() {
    return (
      <div className="row d-flex justify-content-center mt-4">
        <div className="col-sm-8">
          <div className="form-section my-4 border-bottom">
            <h4>Información Básica</h4>
          </div>
          <div className="row">
            <div className="col">
              <label>Nombre del Producto</label>
              <Field
                type="text"
                name="name"
                className="form-control"
                placeholder={"Nombre del Producto"}
              />
            </div>
            <div className="col">
              <label>SKU del Producto</label>
              <Field
                type="text"
                name="sku"
                className="form-control"
                placeholder={"Nombre del Producto"}
              />
            </div>
            {this.props.touched.sku &&
              this.props.errors.sku && (
                <small className="text-danger">{this.props.errors.sku}</small>
              )}
          </div>
        </div>
      </div>
    );
  }
}

const SheetView = props => (
  <span>
    <div className="row sheet-view d-flex flex-column">
      <div className="bg-azure-dark text-light sheet-navbar pt-5 px-3">
        <div className="row">
          <div className="col-2 h5">
            <Link route={props.routeBack}>
              <a className="back-button">
                <i className="fe fe-chevron-left mr-1" />
                <span>Regresar</span>
              </a>
            </Link>
          </div>
          <div className="col-7 text-center">
            <h4 className="m-0">{props.title}</h4>
          </div>
        </div>
      </div>
      <div className="flex-grow-1 sheet-body px-3">{props.content}</div>
      <div className="sheet-footer py-3 border-top px-3 d-flex justify-content-end">
        {props.footer}
      </div>
    </div>
    <style jsx>
      {`
        .sheet-view {
          height: 100%;
        }

        .back-button {
          text-decoration: none;
        }
      `}
    </style>
  </span>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Page);
