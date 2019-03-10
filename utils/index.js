import React, { Component } from "react";
import { ReactReduxContext } from "react-redux";
import PropTypes from "prop-types";

// Create HOC that gets firestore from react context and passes it as a prop
// NOTE: Modified version of withFirestore for a simple example. For a full
// application, use react-redux-firebase's withFirestore: https://goo.gl/4pxmPv
const withFirestore = WrappedComponent => {
  class WithFirestore extends Component {
    render() {
      const Context = ReactReduxContext;
      return (
        <Context.Consumer>
          {({ store }) => (
            <WrappedComponent
              {...this.props}
              dispatch={store.dispatch}
              firestore={store.firestore}
            />
          )}
        </Context.Consumer>
      );
    }
  }
  // Note, for full statics support, use hoist-non-react-statics as done
  // in react-redux-firebase's withFirestore: https://goo.gl/4pxmPv
  return WithFirestore;
};

const withPageProps = WrappedComponent => {
  class WithPageProps extends Component {
    static async getInitialProps({ isServer, pathname, asPath, query }) {
      return { isServer, pathname, asPath, query };
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return WithPageProps;
};

const parseNumber = (value, locale = navigator.language) => {
  const example = Intl.NumberFormat(locale).format("1.1");
  const cleanPattern = new RegExp(`[^-+0-9${example.charAt(1)}]`, "g");
  const cleaned = value.toString().replace(cleanPattern, "");
  const normalized = cleaned.replace(example.charAt(1), ".");

  return parseFloat(normalized);
};

export { withPageProps, withFirestore, parseNumber };
