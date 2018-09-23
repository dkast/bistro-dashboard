import React, { Component } from "react";
import FileUploader from "react-firebase-file-uploader";
import CircularProgressBar from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { firebase } from "../../firebase";

class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploading: false,
      progress: 0
    };
  }

  handleUploadStart = () => {
    if (this.props.filename) {
      //Delete prev uploaded image
      firebase.storage
        .ref("images")
        .child(this.props.filename)
        .delete();
    }

    this.setState({
      isUploading: true,
      progress: 0
    });
  };

  handleProgress = progress =>
    this.setState({
      progress
    });

  handleUploadError = error => {
    this.setState({ isUploading: false });
    console.error(error);
  };

  handleUploadSuccess = filename => {
    this.setState({ progress: 100, isUploading: false });
    firebase.storage
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(url => this.props.onChangeImageURL(url, filename));
  };

  render() {
    return (
      <div>
        <div className="rounded shadow border img-placeholder d-flex align-items-center justify-content-center">
          {!this.state.isUploading &&
            !this.props.imageURL && <i className="fe fe-image" />}
          {!this.state.isUploading &&
            this.props.imageURL && (
              <img src={this.props.imageURL} className="rounded img-fluid" />
            )}
          {this.state.isUploading && (
            <CircularProgressBar
              percentage={this.state.progress}
              className="circular-progress"
              strokeWidth={4}
            />
          )}
        </div>
        <label
          className={
            "btn btn-success btn-block mb-0 mt-1 " +
            (this.props.uploadEnabled ? "" : "invisible")
          }
        >
          {this.props.imageURL ? "Modificar imagen" : "Añadir imagen"}
          <FileUploader
            hidden
            accept="image/*"
            randomizeFilename
            maxWidth={640}
            maxHeight={400}
            storageRef={firebase.storage.ref("images")}
            onUploadStart={this.handleUploadStart}
            onUploadError={this.handleUploadError}
            onUploadSuccess={this.handleUploadSuccess}
            onProgress={this.handleProgress}
          />
        </label>
        <style jsx>{`
          .img-placeholder {
            background-color: #f5f5f5;
            width: 320px;
            height: 200px;
          }

          .img-placeholder i {
            font-size: 6rem;
            color: #e0e0e0;
          }

          div :global(.circular-progress) {
            height: 60% !important;
          }
        `}</style>
      </div>
    );
  }
}

UploadImage.defaultProps = {
  uploadEnabled: true
};

export default UploadImage;
