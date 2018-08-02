import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";

import { PageWithAuthentication } from "../components/app";
import { auth } from "../firebase";
import { connect } from "react-redux";
import { SignInLink } from "./signin";
import CenterFrame from "./../components/layout/centerFrame";
import withFirestore from "../utils";
import Head from "../components/head";
import { Link, Router } from "../routes";

const SignUpPage = props => (
  <PageWithAuthentication>
    <Head title="Sign Up" />
    <CenterFrame>
      <div className="col-md-6">
        <div className="card shadow-lg">
          <div className="card-body p-6">
            <h5 className="card-title">Create New Account</h5>
            <SignUpForm {...props} />
            <SignInLink />
          </div>
        </div>
      </div>
    </CenterFrame>
  </PageWithAuthentication>
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

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;

    auth
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        console.log(authUser);
        //Create a User in the database
        this.props.firestore
          .add(
            { collection: "users" },
            {
              uid: authUser.user.uid,
              username: username,
              email: email
            }
          )
          .then(() => {
            this.setState(() => ({ ...INITIAL_STATE }));
            Router.pushRoute("/");
          })
          .catch(error => {
            this.setState({
              error: error
            });
          });
      })
      .catch(error => {
        this.setState({
          error: error
        });
      });

    event.preventDefault();
  };

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
          Sign Up
        </button>
        {error && (
          <div className="alert alert-danger mb-3">{error.message}</div>
        )}
      </form>
    );
  }
}

const SignUpLink = () => (
  <span>
    Don't have an account?{" "}
    <Link route="signup">
      <a>Sign Up</a>
    </Link>
  </span>
);

export default compose(
  withFirestore,
  connect(state => ({
    firestoreState: state.firestoreState
  }))
)(SignUpPage);

export { SignUpLink };
