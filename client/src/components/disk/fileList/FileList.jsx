import React from "react";
import File from "./file/File";
import "./fileList.scss";
import { useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function FileList() {
  const files = useSelector((state) => state.files.files);
  const fileView = useSelector((state) => state.files.view);

  if (files.length === 0) {
    return <div className="files_not_found">Files not found</div>;
  }

  if (fileView === "plate") {
    return (
      <div className="fileplate">
        {files.map((file) => (
          <File key={file._id} file={file} />
        ))}
      </div>
    );
  }

  if (fileView === "list") {
    return (
      <div className="filelist">
        <div className="filelist_header">
          <div className="filelist_name">Name</div>
          <div className="filelist_date">Date</div>
          <div className="filelist_size">Size</div>
          <div className="filelist_set">Set</div>
        </div>
        <TransitionGroup>
          {files.map((file) => (
            <CSSTransition
              key={file._id}
              timeout={500}
              classNames={"file"}
              exit={false}
            >
              <File file={file} />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    );
  }
}

export default FileList;
