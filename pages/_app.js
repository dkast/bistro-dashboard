import React, { Component } from "react";
import { Provider } from "react-redux";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import "react-table/react-table.css";
import withNProgress from "next-nprogress";

import initStore from "../store";

const MS_DELAY = 200;
const CONFIG_OPTIONS = { trickleSpeed: 50 };

export default withNProgress(MS_DELAY, CONFIG_OPTIONS)(withRedux(initStore))(
  class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
      if (ctx.isServer) {
        const asPath = ctx.asPath;
        console.log(asPath);
        ctx.store.dispatch({
          type: "SIDEBAR_SELECTED_SET",
          routeSelected: asPath
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
        <>
          <Container>
            <Provider store={store}>
              <Component {...pageProps} />
            </Provider>
          </Container>
          <style jsx global>{`
            #__next,
            .app {
              height: 100%;
            }
          `}</style>
        </>
      );
    }
  }
);
