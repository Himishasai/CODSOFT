const fs = require("fs");

const readJSON = (filePath) => {
  const data = fs.readFileSync(filePath, "utf8");

  return JSON.parse(data);
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    "utf8"
  );
};

module.exports = {
  readJSON,
  writeJSON,
};