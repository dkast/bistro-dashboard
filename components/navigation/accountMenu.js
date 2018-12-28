import React, { Component, createRef } from "react";
import { connect } from "react-redux";

import { auth } from "../../firebase";

class AccountMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false
    };
    this.dropdown = createRef();
  }

  showDropdown(e) {
    e.preventDefault();
    this.setState(prevState => ({
      showDropdown: !prevState.showDropdown
    }));
  }

  componentDidMount() {
    // handles mouse events like click and double click
    document.addEventListener("mouseup", this.handleMouseEvent);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseEvent);
  }

  hasFocus = target => {
    let dropDownHasFocus = false;
    const nodeIterator = document.createNodeIterator(
      this.dropdown.current,
      NodeFilter.SHOW_ELEMENT,
      null,
      false
    );
    let node;

    while ((node = nodeIterator.nextNode())) {
      if (node === target) {
        dropDownHasFocus = true;
        break;
      }
    }

    return dropDownHasFocus;
  };

  handleMouseEvent = event => {
    const dropDownHasFocus = this.hasFocus(event.target);

    if (!dropDownHasFocus) {
      this.setState({
        showDropdown: false
      });
    }
  };

  render() {
    const classDropdownMenu =
      "dropdown-menu dropdown-menu-right dropdown-menu-arrow " +
      (this.state.showDropdown ? "show" : "");

    const { authUser } = this.props;

    return (
      <div className="dropdown float-right" ref={this.dropdown}>
        <span
          className="avatar avatar-placeholder mx-2 dropdown-toggle"
          onClick={event => {
            this.showDropdown(event);
          }}
        />
        <div className={classDropdownMenu}>
          <span className="dropdown-item-text text-muted">
            {authUser.email}
          </span>
          <div className="dropdown-divider" />
          <button className="dropdown-item" onClick={auth.doSignOut}>
            Salir
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authUser: state.sessionState.authUser
});

export default connect(mapStateToProps)(AccountMenu);
