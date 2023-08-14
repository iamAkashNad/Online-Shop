const fs = require("fs");
const path = require("path");

const successPath = path.join(__dirname, "..", "logs", "success.log");
const errorsPath = path.join(__dirname, "..", "logs", "errors.log");

const successLogStream = fs.createWriteStream(successPath, { flags: "a" });
const errorLogStream = fs.createWriteStream(errorsPath, { flags: "a" });

const morganFormatConfig = (tokens, req, res) => {
  return [
    "=>",
    tokens.method(req, res),
    '"' + tokens.url(req, res) + '"',
    tokens.status(req, res),
    tokens.res(req, res, "content-length"),
    "-",
    tokens["response-time"](req, res),
    "ms",
    "(" + tokens.date(req, res, "web") + ")"
  ].join(" ");
};

const morganSuccessConfig = () => {
  return {
    stream: successLogStream,
    skip: (req, res) => res.statusCode >= 400,
  };
};

const morganErrorConfig = () => {
  return {
    stream: errorLogStream,
    skip: (req, res) => res.statusCode < 400,
  };
};

module.exports = { morganFormatConfig, morganSuccessConfig, morganErrorConfig };
