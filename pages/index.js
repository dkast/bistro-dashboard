import React, { Component } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import Head from "../components/head";
import { PageWithAuthorization } from "../components/app";

class Page extends Component {
  render() {
    return (
      <>
        <Head title="Home" />
        <PageWithAuthorization>
          <h1>Home</h1>
        </PageWithAuthorization>
      </>
    );
  }
}

export default connect()(Page);
