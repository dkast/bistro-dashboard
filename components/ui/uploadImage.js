import React, { Component } from "react";

class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className=" bg-gray-lightest rounded img-upload shadow border">
        <div className="img-placeholder d-flex align-content-center justify-content-center text-gray">
          <i className="fe fe-image" />
        </div>
        <button className="btn btn-default btn-block">Cargar</button>
        <style jsx>{`
          .img-upload {
            width: 200px;
          }
          .img-placeholder {
            // background-color: #f5f5f5;
            height: 150px;
          }

          .img-placeholder i {
            font-size: 6rem;
            // color: #e0e0e0;
          }
        `}</style>
      </div>
    );
  }
}

export default UploadImage;
