import React from "react";

const Loader = () => (
  <div className="d-flex align-items-center justify-content-center spinner">
    <div className="loader" />
    <style jsx>{`
      .spinner {
        min-height: 100%;
      }
      .loader {
        height: 5rem;
        width: 5rem;
      }
    `}</style>
  </div>
);

export default Loader;
