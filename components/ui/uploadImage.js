import React, { Component } from "react";

class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="rounded img-upload shadow border p-1">
        <div className="img-placeholder d-flex align-items-center justify-content-center">
          <i className="fe fe-image" />
        </div>
        <span className="btn btn-success btn-block">Añadir</span>
        <style jsx>{`
          .img-upload {
            width: 200px;
          }
          .img-placeholder {
            background-color: #f5f5f5;
            height: 120px;
          }

          .img-placeholder i {
            font-size: 6rem;
            color: #e0e0e0;
          }
        `}</style>
      </div>
    );
  }
}

export default UploadImage;
