import React, { Component } from "react";
import { Provider } from "react-redux";
import App, { Container } from "next/app";
import withRedux from "next-redux-wrapper";
import { PageTransition } from "next-page-transitions";
import "react-table/react-table.css";

import initStore from "../store";
import Loader from "../components/ui/loader";

const TIMEOUT = 300;

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
        <>
          <Container>
            <Provider store={store}>
              <PageTransition
                timeout={TIMEOUT}
                classNames="page-transition"
                loadingComponent={<Loader />}
                loadingDelay={10}
                loadingTimeout={{
                  enter: TIMEOUT,
                  exit: 0
                }}
                loadingClassNames="loading-indicator"
              >
                <Component {...pageProps} />
              </PageTransition>
            </Provider>
          </Container>
          <style jsx global>{`
            #__next,
            .app {
              height: 100%;
            }
            .page-transition-enter {
              opacity: 0;
              transform: translate3d(0, 20px, 0);
            }
            .page-transition-enter-active {
              opacity: 1;
              transform: translate3d(0, 0, 0);
              transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
            }
            .page-transition-enter-done {
              height: 100%;
            }
            .page-transition-exit {
              opacity: 1;
            }
            .page-transition-exit-active {
              opacity: 0;
              transition: opacity ${TIMEOUT}ms;
            }
            .loading-indicator-appear,
            .loading-indicator-enter {
              opacity: 0;
            }
            .loading-indicator-appear-active,
            .loading-indicator-enter-active {
              opacity: 1;
              transition: opacity ${TIMEOUT}ms;
            }
          `}</style>
        </>
      );
    }
  }
);
