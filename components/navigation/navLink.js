import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import routes, { Link } from "../../routes";
import { withRouter } from "next/router";

class NavLink extends React.Component {
  render() {
    const componentName = "nav-link";

    const {
      activeClassName,
      className,
      children,
      router,
      ...props
    } = this.props;

    const isActiveRoute =
      props.route === undefined
        ? false
        : routes.findAndGetUrls(props.route, props.params).urls.as ===
          router.asPath;

    return (
      <Link {...props}>
        <a
          className={classNames(componentName, className, {
            [`${activeClassName}`]: isActiveRoute
          })}
          {...props}
        >
          {children}
        </a>
      </Link>
    );
  }
}

NavLink.propTypes = {
  activeClassName: PropTypes.string.isRequired
};

NavLink.defaultProps = {
  activeClassName: "active"
};

export default withRouter(NavLink);
