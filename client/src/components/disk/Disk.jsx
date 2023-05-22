import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDir, getFiles, uploadFile } from "../../action/file";
import {
  popFromStack,
  pushToStack,
  setCurrentDir,
  setFileView,
  setPopupDisplay,
} from "./../../reducers/fileReducer";
import FileList from "./fileList/FileList";
import "./disk.scss";
import Popup from "./Popup";
import Uploader from "./uploader/Uploader";

function Disk() {
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  const loader = useSelector((state) => state.app.loader);

  const dirStack = useSelector((state) => state.files.dirStack);
  const [dragEnter, setDragEnter] = useState(false);
  const [sort, setSort] = useState("type");

  useEffect(() => {
    dispatch(getFiles(currentDir, sort));
  }, [currentDir, sort]);

  function showPopupHandler() {
    dispatch(setPopupDisplay("flex"));
  }

  function backClickHandler() {
    dispatch(setCurrentDir(dirStack.slice(-1)[0]));
    dispatch(popFromStack());
  }

  function fileUploadHandler(event) {
    const files = [...event.target.files];
    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
  }

  function dragEnterHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(true);
  }

  function dragLeaveHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(false);
  }

  function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    let files = [...event.dataTransfer.files];
    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
    setDragEnter(false);
  }

  if (loader === true) {
    return (
      <div className="loader">
        <div className="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return !dragEnter ? (
    <div
      className="disk"
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      <div className="disk_btns">
        <div className="disk_action-block">
          <button className="disk_back" onClick={() => backClickHandler()}>
            Back
          </button>
          <button className="disk_create" onClick={() => showPopupHandler()}>
            Create folder
          </button>
          <div className="disk_upload">
            <label htmlFor="disk_upload-input" className="disk_upload-label">
              Upload File
            </label>
            <input
              type="file"
              multiple={true}
              id="disk_upload-input"
              className="disk_upload-input"
              onChange={(event) => fileUploadHandler(event)}
            />
          </div>
        </div>
        <div className="disk_view-block">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="disk_select"
          >
            <option value="name">By name</option>
            <option value="type">By type</option>
            <option value="date">By date</option>
          </select>
          <button
            className="disk_plate"
            onClick={() => dispatch(setFileView("plate"))}
          ></button>
          <button
            className="disk_list"
            onClick={() => dispatch(setFileView("list"))}
          ></button>
        </div>
      </div>
      <FileList />
      <Popup />
      <Uploader />
    </div>
  ) : (
    <div
      className="drop-area"
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
      onDrop={dropHandler}
    >
      Drag files here
    </div>
  );
}

export default Disk;
