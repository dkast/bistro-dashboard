import React, { Component } from "react";
import FileUploader from "react-firebase-file-uploader";
import { firebase } from "../../firebase";

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
        <label className="btn btn-success btn-block m-0">
          Añadir
          <FileUploader
            hidden
            accept="image/*"
            storageRef={firebase.storage.ref("images")}
          />
        </label>
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
