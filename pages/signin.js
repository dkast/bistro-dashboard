import React, { Component } from "react";
import { Router } from "next/router";
import { PageWithAuthentication } from "../components/app";
import { auth } from "../firebase";
import { connect } from "react-redux";
import Head from "../components/head";
import CenterFrame from "./../components/layout/centerFrame";

const SignInPage = () => (
  <>
    <Head title="Sign In" />
    <PageWithAuthentication>
      <CenterFrame>
        <div className="col-md-8">
          <div className="card-group shadow-lg">
            <div className="card">
              <div className="card-body p-6">
                <h5 className="card-title">Welcome</h5>
                <SignInForm />
              </div>
            </div>
            <div className="card bg-svg text-light d-none d-md-none d-lg-block" />
          </div>
        </div>
      </CenterFrame>
    </PageWithAuthentication>
  </>
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
        Router.push("/");
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
      <form onSubmit={this.onSubmit}>
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
              placeholder="Email"
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
              placeholder="Password"
            />
          </div>
        </div>

        <button
          className="btn btn-azure btn-block mb-3"
          disabled={isInvalid}
          type="submit"
        >
          Sig In
        </button>

        {error && <div className="alert alert-danger">{error.message}</div>}
      </form>
    );
  }
}

export default connect()(SignInPage);
