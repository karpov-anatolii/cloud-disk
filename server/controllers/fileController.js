const config = require("config");
const User = require("../models/User");
const File = require("../models/File");
const fileService = require("../services/fileService");
const fs = require("fs");
const Uuid = require("uuid");
const path = require("path");

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findOne({ _id: parent });
      let myres;
      if (!parentFile) {
        console.log("Parent is absent");
        file.path = name;
        await fileService.createDir(req, file);
      } else {
        file.path = parentFile.path + path.sep + file.name;
        console.log("+++++++++++++file.path===========", file.path);
        await fileService.createDir(req, file);
        parentFile.childs.push(file._id);
        await parentFile.save();
      }
      await file.save();
      return res.json(file);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getFiles(req, res) {
    try {
      const { sort } = req.query;
      let files;
      switch (sort) {
        case "name":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ name: 1 });
          break;
        case "type":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ type: 1 });
          break;
        case "date":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ date: 1 });
          break;
        default:
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          });
          break;
      }
      return res.json(files);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Can't get files" });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;
      const parent = await File.findOne({
        user: req.user.id,
        _id: req.body.parent,
      }); // find parent folder of uploaded file
      const user = await User.findOne({ _id: req.user.id }); // find user for checking of memory  available
      if (user.usedSpace + file.size > user.diskSpace) {
        return res
          .status(400)
          .json({ message: "There is no space on the disk" });
      }
      user.usedSpace += file.size;

      let fullPath;
      console.log("++++++++++++++++++++ req.flePath ========", req.filePath);
      console.log("++++++++++++++++++++ user._id ========", user._id);
      console.log("++++++++++++++++++++ parent.path ========", parent?.path);
      console.log("++++++++++++++++++++ file.name ========", file.name);
      console.log("++++++++++++++++++++ path.sep ========", path.sep);
      if (parent) {
        fullPath =
          req.filePath +
          path.sep +
          user._id +
          path.sep +
          parent.path +
          path.sep +
          file.name;
      } else {
        fullPath = req.filePath + path.sep + user._id + path.sep + file.name;
      }

      if (fs.existsSync(fullPath)) {
        return res.status(400).json({ message: "File already exists" });
      }
      file.mv(fullPath);

      const type = file.name.split(".").pop();
      let filePath = file.name;
      if (parent) {
        filePath = parent.path + path.sep + file.name;
      }
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: filePath,
        parent: parent ? parent._id : null,
        user: user._id,
      });

      await dbFile.save();
      await user.save();

      res.json(dbFile);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Upload error" });
    }
  }

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      const path = fileService.getPath(req, file);

      if (fs.existsSync(path)) {
        return res.download(path, file.name);
      }
      return res.status(400).json({ message: "Download error" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Download error" });
    }
  }

  async deleteFile(req, res) {
    try {
      const file = await File.findOne({ _id: req.query.id, user: req.user.id });
      if (!file) {
        return res.status(400).json({ message: "File not found" });
      }
      fileService.deleteFile(req, file);
      await file.deleteOne(); //delete document from db
      return res.json({ message: "File was deleted" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Dir is not empty" });
    }
  }

  async renameFile(req, res) {
    try {
      const { id, name } = req.query;
      const file = await File.findOne({
        user: req.user.id,
        _id: id,
      });

      fileService.renameFile(req, file, name);

      let oldName = file.name;
      let regexpOldName = new RegExp(`${oldName}$`);
      file.path = file.path.replace(regexpOldName, name);
      file.name = name;
      await file.save();

      async function changePath(id, oldName, newName) {
        let childs = await File.find({
          user: req.user.id,
          parent: id,
        });
        childs.map(async (child) => {
          let pathArr = child.path.split(path.sep);
          child.path = pathArr
            .map((el) => (el == oldName ? newName : el))
            .join(path.sep);
          await child.save();
          console.log(child.path);
          if (child.childs.length > 0) changePath(child.id, oldName, newName);
        });
      }

      changePath(id, oldName, name);

      res.json(file);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Rename error" });
    }
  }

  async searchFile(req, res) {
    try {
      const searchName = req.query.search;
      let files = await File.find({ user: req.user.id });
      files = files.filter((file) => file.name.includes(searchName));
      return res.json(files);
    } catch (error) {
      console.log("ERROR!!!", error);
      return res.status(400).json({ message: "Search error" });
    }
  }

  async uploadAvatar(req, res) {
    try {
      const file = req.files.file;
      const user = await User.findById(req.user.id);
      const avatarName = Uuid.v4() + ".jpg";

      file.mv(path.resolve(req.staticPath, avatarName));
      user.avatar = avatarName;
      await user.save();
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Upload avatar error" });
    }
  }

  async deleteAvatar(req, res) {
    try {
      const user = await User.findById(req.user.id);
      fs.unlinkSync(path.resolve(req.staticPath, user.avatar));
      user.avatar = null;
      await user.save();
      return res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: "Delete avatar error" });
    }
  }
}

module.exports = new FileController();
