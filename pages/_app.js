import React, { Component } from "react";
import { Provider } from "react-redux";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import initStore from "../store";

export default withRedux(initStore)(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx, pathname }) {
      if (ctx.isServer) {
        const pathname = ctx.pathname;
        console.log(pathname);
        ctx.store.dispatch({
          type: "SIDEBAR_SELECTED_SET",
          routeSelected: pathname
        });
      }

      let pageProps = {};

      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      return { pageProps };
    }

    render() {
      const { Component, pageProps, store } = this.props;
      //console.log(this.props);
      return (
        <Container>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </Container>
      );
    }
  }
);
