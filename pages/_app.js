import React, { Component } from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import withNProgress from "next-nprogress";
import "react-table/react-table.css";

import initStore from "../store";
import Notification from "../components/ui/notifcation";
import "../static/scss/bundle.scss";

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
            <Head>
              <title>Bistro Dashboard</title>
            </Head>
            <Provider store={store}>
              <Notification>
                <Component {...pageProps} />
              </Notification>
            </Provider>
          </Container>
          <style jsx global>{`
            #__next,
            .app,
            .page {
              min-height: 100vh !important;
            }
          `}</style>
        </>
      );
    }
  }
);
