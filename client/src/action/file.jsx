import axios from "axios";
import { API_URL } from "../config";
import { hideLoader, showLoader } from "../reducers/appReducer";
import {
  addFile,
  deleteFileAction,
  renameFileAction,
  setFiles,
} from "../reducers/fileReducer";
import {
  addUploadFile,
  changeUploadFile,
  hideUploader,
  showUploader,
} from "../reducers/uploadReducer";

export function getFiles(dirId, sort) {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      let url = `${API_URL}api/files`;
      if (dirId) {
        url = `${API_URL}api/files?parent=${dirId}`;
      }
      if (sort) {
        url = `${API_URL}api/files?sort=${sort}`;
      }
      if (dirId && sort) {
        url = `${API_URL}api/files?parent=${dirId}&sort=${sort}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(setFiles(response.data));
    } catch (err) {
      alert(err.response.data.message);
    } finally {
      dispatch(hideLoader());
    }
  };
}

export function createDir(dirId, name) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${API_URL}api/files`,
        {
          name,
          parent: dirId,
          type: "dir",
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(addFile(response.data));
    } catch (err) {
      alert(err.response.data.message);
    }
  };
}

export function uploadFile(file, dirId) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (dirId) {
        formData.append("parent", dirId);
      }
      const uploadFile = { name: file.name, progress: 0, id: Date.now() };
      dispatch(showUploader());
      dispatch(addUploadFile(uploadFile));
      const response = await axios.post(
        `${API_URL}api/files/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          // onUploadProgress: (progressEvent) => {
          //   const totalLength = progressEvent.event.lengthComputable
          //     ? progressEvent.total
          //     : progressEvent.event.target.getResponseHeader(
          //         "content-length"
          //       ) ||
          //       progressEvent.event.target.getResponseHeader(
          //         "x-decompressed-content-length"
          //       );
          //   if (totalLength) {
          //     uploadFile.progress = Math.round(
          //       (progressEvent.loaded * 100) / totalLength
          //     );
          //     dispatch(changeUploadFile(uploadFile));
          //   }
          // },
          onUploadProgress: (data) => {
            uploadFile.progress = Math.round((100 * data.loaded) / data.total);
            dispatch(changeUploadFile(uploadFile));
          },
        }
      );
      dispatch(addFile(response.data));
    } catch (err) {
      alert(err.response.data.message);
    }
  };
}

export async function downloadFile(file) {
  const response = await fetch(`${API_URL}api/files/download?id=${file._id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (response.status === 200) {
    const blob = await response.blob(); // to get blob in fetch query is easier then in axios
    // we've got file as blob from server and now have to convert it in normal file and save
    // in JS we can use hook for this with creation invisible link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.name;
    document.body.appendChild(link);
    //imitate user's click on this link for downloading file
    link.click();
    link.remove();
  }
}

export function deleteFile(file) {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${API_URL}api/files?id=${file._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(deleteFileAction(file._id));
      alert(response.data.message);
    } catch (err) {
      alert(err?.response?.data?.message);
    }
  };
}

export function renameFile(file, fileName) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${API_URL}api/files/rename?id=${file._id}&name=${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(renameFileAction(response.data));
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };
}

export function searchFiles(search) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${API_URL}api/files/search?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(setFiles(response.data));
    } catch (err) {
      alert(err?.response?.data?.message);
    } finally {
      dispatch(hideLoader());
    }
  };
}
