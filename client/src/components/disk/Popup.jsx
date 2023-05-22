import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDir } from "../../action/file";
import { setPopupDisplay } from "../../reducers/fileReducer";
import Input from "../../utils/input/Input";
import "./disk.scss";

const Popup = () => {
  const [dirName, setDirName] = useState("");
  const popupDisplay = useSelector((state) => state.files.popupDisplay);
  const currentDir = useSelector((state) => state.files.currentDir);

  const dispatch = useDispatch();

  const createHandler = () => {
    dispatch(createDir(currentDir, dirName));
    setDirName("");
    dispatch(setPopupDisplay("none"));
  };

  return (
    <div
      className="popup"
      onClick={() => dispatch(setPopupDisplay("none"))}
      style={{ display: popupDisplay }}
    >
      <div
        className="popup_content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="popup_header">
          <div className="popup_title">Create a new folder</div>
          <button onClick={() => dispatch(setPopupDisplay("none"))}>X</button>
        </div>
        <Input
          type="text"
          placeholder="Enter folder's name"
          value={dirName}
          setValue={setDirName}
        />
        <button className="popup_create" onClick={() => createHandler()}>
          Create
        </button>
      </div>
    </div>
  );
};

export default Popup;
