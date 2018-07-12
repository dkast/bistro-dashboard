import React, { Component } from "react";
import Link from "next/link";
import Router from "next/router";
import PropTypes from 'prop-types';
import { PageWithAuthentication } from "../components/app";
import { auth } from "../firebase";
import { connect } from "react-redux";
import Head from "../components/head";
import CenterFrame from "./../components/layout/centerFrame";

const SignUpPage = () => (
  <>
    <Head title="Sign Up" />
    <PageWithAuthentication>
      <CenterFrame>
        <div className="col-sm-4">
          <div className="card shadow-lg">
            <div className="card-body p-6">
              <h5 className="card-title">Create New Account</h5>
              <SignUpForm />
            </div>
          </div>
        </div>
      </CenterFrame>
    </PageWithAuthentication>
  </>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        //TODO: Create user in your own database
      })
      .catch(error => {
        this.setState = {
          error: error
        };
      });

    event.preventDefault();
  };

  onTest = event => {
    alert("OK!");
    const { firestore } = this.context.store;
    firestore.add({ collection: 'cities' }, { name: 'Piedras Negras' })
    event.preventDefault();
  }

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === "" || username === "";

    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className={"form-control mb-3 " + (error ? "is-invalid" : "")}
            value={username}
            onChange={event =>
              this.setState({
                username: event.target.value
              })
            }
            placeholder="Enter name"
          />
          <label className="form-label">Email Address</label>
          <input
            type="text"
            className={"form-control mb-3 " + (error ? "is-invalid" : "")}
            value={email}
            onChange={event =>
              this.setState({
                email: event.target.value
              })
            }
            placeholder="Enter email"
          />
          <label className="form-label">Password</label>
          <input
            type="password"
            className={"form-control mb-3 " + (error ? "is-invalid" : "")}
            value={passwordOne}
            onChange={event =>
              this.setState({
                passwordOne: event.target.value
              })
            }
            placeholder="Password"
          />
          <input
            type="password"
            className={"form-control mb-3 " + (error ? "is-invalid" : "")}
            value={passwordTwo}
            onChange={event =>
              this.setState({
                passwordTwo: event.target.value
              })
            }
            placeholder="Confirm password"
          />
        </div>
        <button
          className="btn btn-azure btn-block mb-3"
          disabled={isInvalid}
          type="submit"
        >
          Sig Up
        </button>
        <button
          className="btn btn-purple btn-block mb-3"
          onClick={this.onTest}
        >Test</button>
        {error && <div className="alert alert-danger">{error.message}</div>}
      </form>
    );
  }
}

export default connect((state) => ({
    firebase: state.firebase
  })
)(SignUpPage);
