import React, { Component } from "react";
import { connect } from "react-redux";

import { PageWithAuthentication } from "../components/app";
import { auth } from "../firebase";
import { SignUpLink } from "./signup";
import CenterFrame from "./../components/layout/centerFrame";
import { Link, Router } from "../routes";

const SignInPage = () => (
  <PageWithAuthentication>
    <CenterFrame>
      <div className="col-md-8">
        <div className="card-group shadow-lg animated fadeIn">
          <div className="card">
            <div className="card-body p-6">
              <h5 className="card-title">Bienvenido</h5>
              <SignInForm />
              <SignUpLink />
            </div>
          </div>
          <div className="card bg-svg text-light d-none d-md-none d-lg-block" />
        </div>
      </div>
    </CenterFrame>
  </PageWithAuthentication>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        Router.pushRoute("/");
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });

    event.preventDefault();
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <form onSubmit={this.onSubmit} className={error ? "animated shake" : ""}>
        <div className="form-group">
          <div className="input-icon mb-3">
            <span className="input-icon-addon">
              <i className="fe fe-mail" />
            </span>
            <input
              type="text"
              className={"form-control " + (error ? "is-invalid" : "")}
              value={email}
              onChange={event =>
                this.setState({
                  email: event.target.value
                })
              }
              placeholder="E-mail"
            />
          </div>
          <div className="input-icon mb-3">
            <span className="input-icon-addon">
              <i className="fe fe-lock" />
            </span>
            <input
              type="password"
              className={"form-control " + (error ? "is-invalid" : "")}
              value={password}
              onChange={event =>
                this.setState({
                  password: event.target.value
                })
              }
              placeholder="Contraseña"
            />
          </div>
        </div>

        <button
          className="btn btn-azure btn-block mb-3"
          disabled={isInvalid}
          type="submit"
        >
          Continuar
        </button>

        {error && (
          <div className="alert alert-danger mb-3">{error.message}</div>
        )}
      </form>
    );
  }
}

const SignInLink = () => (
  <span>
    ¿Ya tienes una cuenta?{" "}
    <Link route="signin">
      <a>Ingresa</a>
    </Link>
  </span>
);

export default connect()(SignInPage);

export { SignInLink };
