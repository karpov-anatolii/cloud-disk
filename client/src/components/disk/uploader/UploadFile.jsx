import React from "react";
import "./uploader.scss";
import { useDispatch } from "react-redux";
import { removeUploadFile } from "../../../reducers/uploadReducer";

const UploadFile = ({ file }) => {
  const dispatch = useDispatch();
  return (
    <div className="upload-file">
      <div className="upload-file_header">
        <div className="upload-file_name">{file.name}</div>
        <button
          className="upload-file_remove"
          onClick={() => dispatch(removeUploadFile(file.id))}
        >
          X
        </button>
      </div>
      <div className="upload-file_progress-bar">
        <div
          className="upload-file_upload-bar"
          style={{ width: file.progress + "%" }}
        ></div>
        <div className="upload-file_percent">{file.progress}%</div>
      </div>
    </div>
  );
};

export default UploadFile;
