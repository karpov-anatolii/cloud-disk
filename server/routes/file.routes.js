const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const fileController = require("../controllers/fileController");

router.post("", authMiddleware, fileController.createDir);
router.post("/upload", authMiddleware, fileController.uploadFile);
router.post("/avatar", authMiddleware, fileController.uploadAvatar);
router.get("", authMiddleware, fileController.getFiles);
router.get("/download", authMiddleware, fileController.downloadFile);
router.get("/search", authMiddleware, fileController.searchFile);
router.get("/rename", authMiddleware, fileController.renameFile);
router.delete("/", authMiddleware, fileController.deleteFile); //delete method hasn't req.body and all parameters are passed in url
router.delete("/avatar", authMiddleware, fileController.deleteAvatar); //delete method hasn't req.body and all parameters are passed in url

module.exports = router;
