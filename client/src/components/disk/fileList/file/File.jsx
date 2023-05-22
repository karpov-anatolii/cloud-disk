import React, { useState } from "react";
import "./file.scss";
import { AiFillFile, AiFillFolder } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { pushToStack, setCurrentDir } from "../../../../reducers/fileReducer";
import { deleteFile, downloadFile, renameFile } from "../../../../action/file";
import sizeFormat from "../../../../utils/sizeFormat";
import { IoMdSettings } from "react-icons/io";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useRef } from "react";

function File({ file }) {
  // console.log(file);
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  const fileView = useSelector((state) => state.files.view);
  const [showSettings, setShowSettings] = useState(false);
  const [fileName, setFileName] = useState(file.name);

  function openDirHandler(file) {
    if (file.type === "dir") {
      dispatch(pushToStack(currentDir));
      dispatch(setCurrentDir(file._id));
    }
  }

  function downloadClickHandler(e) {
    // e.stopPropagation();
    downloadFile(file);
  }

  function deleteClickHandler(e) {
    // e.stopPropagation();
    dispatch(deleteFile(file));
  }

  function renameClickHandler(e) {
    // e.stopPropagation();
    dispatch(renameFile(file, fileName));
  }

  if (fileView === "plate") {
    return (
      <div className="file-plate" onClick={() => openDirHandler(file)}>
        {/* <img src="" alt="" className="file_img" /> */}
        <div className="file-plate_icon">
          {file.type === "dir" ? <AiFillFolder /> : <AiFillFile />}
        </div>
        <div className="file-plate_name">{file.name}</div>
        <div className="file-plate_btns">
          {file.type !== "dir" && (
            <button
              className="file-plate_btn file_download"
              onClick={(e) => downloadClickHandler(e)}
            >
              Download
            </button>
          )}
          <button
            onClick={(e) => deleteClickHandler(e)}
            className="file-plate_btn file_delete"
          >
            Detete
          </button>
        </div>
      </div>
    );
  }

  if (fileView === "list") {
    return (
      <div className="file">
        {/* <img src="" alt="" className="file_img" /> */}
        <div className="file_icon" onClick={() => openDirHandler(file)}>
          {file.type === "dir" ? <AiFillFolder /> : <AiFillFile />}
        </div>
        <div className="file_name" onClick={() => openDirHandler(file)}>
          {file.name}
        </div>
        <div className="file_date">
          {file.date.slice(2, 10).split("-").reverse().join("/")}
        </div>
        <div className="file_size">{sizeFormat(file.size)}</div>
        <div
          className="file_settings"
          onClick={() => setShowSettings(!showSettings)}
        >
          {<IoMdSettings />}
        </div>

        <CSSTransition
          in={showSettings}
          unmountOnExit
          timeout={300}
          classNames="set"
        >
          <div
            className="file_row-settings"
            // style={{ display: showSettings ? "flex" : "none" }}
          >
            {file.type !== "dir" && (
              <button
                className="file_btn file_download"
                onClick={(e) => downloadClickHandler(e)}
              >
                Download
              </button>
            )}

            <div className="file_rename">
              <button
                className="file_btn file_rename"
                onClick={(e) => renameClickHandler(e)}
              >
                Rename File
              </button>
              <input
                type="text"
                className=""
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <button
              onClick={(e) => deleteClickHandler(e)}
              className="file_btn file_delete"
            >
              Detete
            </button>
          </div>
        </CSSTransition>
      </div>
    );
  }
}

export default File;
