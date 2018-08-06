import React, { Component } from "react";
import { connect } from "react-redux";

import { PageWithAuthorization } from "../components/app";
import Layout from "../components/layout";

class Page extends Component {
  render() {
    const { authUser } = this.props;
    return (
      <>
        <PageWithAuthorization>
          {authUser && <ItemDetailPage {...this.props} />}
        </PageWithAuthorization>
      </>
    );
  }
}

class ItemDetailPage extends Component {
  state = {};
  render() {
    return (
      <Layout>
        <div className="row sheet-view d-flex flex-column">
          <div className="bg-azure-dark text-light sheet-title py-5 px-3">
            <h4 className="m-0">Crea Nuevo Item</h4>
          </div>
          <div className="flex-grow-1 sheet-body px-3">
            <div className="row d-flex justify-content-center">
              <div className="col-sm-6">form</div>
            </div>
          </div>
          <div className="sheet-footer py-3 border-top px-3 d-flex justify-content-end">
            <button className="btn btn-azure">Guardar</button>
          </div>
        </div>
        <style jsx>
          {`
            .sheet-view {
              height: 100%;
            }
          `}
        </style>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(Page);
