const fs = require("fs");
const File = require("../models/File");
const config = require("config");
const { join } = require("path");
const path = require("path");

class FileService {
  createDir(req, file) {
    const filePath = this.getPath(req, file);
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(req.filePath + path.sep + file.user)) {
          fs.mkdirSync(req.filePath + path.sep + file.user);
        }

        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: "File was created" });
        } else {
          return reject({ message: "File already exists" });
        }
      } catch (err) {
        return reject({ message: "File error=", err });
      }
    });
  }

  deleteFile(req, file) {
    const path = this.getPath(req, file);
    if (file.type === "dir") {
      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
  }

  renameFile(req, file, name) {
    const oldPath = this.getPath(req, file);
    const pathArr = file.path.split(path.sep);
    pathArr[pathArr.length - 1] = name;
    const fullPath =
      req.filePath + path.sep + file.user + path.sep + pathArr.join(path.sep);
    fs.rename(oldPath, fullPath, function (err) {
      if (err) {
        console.log("ERROR: " + err);
        return;
      }
    });
  }

  getPath(req, file) {
    return req.filePath + path.sep + file.user + path.sep + file.path;
  }
}

module.exports = new FileService();
