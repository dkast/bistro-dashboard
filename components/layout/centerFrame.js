import React from "react";

class CenterFrame extends React.Component {
  render() {
    return (
      <>
        <div className="center-frame d-flex flex-row align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              {this.props.children}
            </div>
          </div>
          <style jsx>
            {`
              .center-frame {
                min-height: 100vh;
              }
            `}
          </style>
        </div>
      </>
    );
  }
}

export default CenterFrame;
