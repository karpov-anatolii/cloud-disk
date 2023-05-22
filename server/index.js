require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const fileUpload = require("express-fileupload");
const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");
const path = require("path");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || config.get("serverPort"); //get method of config module
// const corsMiddleware = require("./middleware/cors.middleware");
// app.use(corsMiddleware);
const { filePath, staticPath } = require("./middleware/filepath.middleware");
app.use(fileUpload({}));
app.use(filePath(path.resolve(__dirname, "files")));
app.use(staticPath(path.resolve(__dirname, "static")));

app.use(express.json());
app.use(express.static("static"));
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

//function for connection to DB and launch server
// connection to DB is an async process
const start = async () => {
  try {
    await mongoose.connect(config.get("dbUrl"));
    app.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
