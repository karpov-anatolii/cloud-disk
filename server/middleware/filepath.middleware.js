function filePath(path) {
  return function (req, res, next) {
    req.filePath = path;
    next();
  };
}

function staticPath(path) {
  return function (req, res, next) {
    req.staticPath = path;
    next();
  };
}

module.exports = { filePath, staticPath };
