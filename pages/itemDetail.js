import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Field, withFormik } from "formik";
import * as Yup from "yup";

import { PageWithAuthorization } from "../components/app";
import Layout from "../components/layout";

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
      <div>
        <Field type="text" name="name" />
        {this.props.touched.name &&
          this.props.errors.name && <p>{this.props.errors.name}</p>}
      </div>
    );
  }
}

const SheetView = props => (
  <span>
    <div className="row sheet-view d-flex flex-column">
      <div className="bg-azure-dark text-light sheet-title py-5 px-3">
        <h4 className="m-0">{props.title}</h4>
      </div>
      <div className="flex-grow-1 sheet-body px-3">
        <div className="row d-flex justify-content-center">
          <div className="col-sm-6">{props.content}</div>
        </div>
      </div>
      <div className="sheet-footer py-3 border-top px-3 d-flex justify-content-end">
        {props.footer}
      </div>
    </div>
    <style jsx>
      {`
        .sheet-view {
          height: 100%;
        }
      `}
    </style>
  </span>
);

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Page);
