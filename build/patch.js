const fs = require("node:fs");
const path = require("node:path");

let fileName = path.resolve(
  __dirname,
  "../node_modules/@ngtools/webpack/src/ivy/plugin.js"
);
let contents = fs.readFileSync(fileName, "utf8");
contents = contents.replace(
  "directTemplateLoading: true,",
  "directTemplateLoading: false,"
);
fs.writeFileSync(fileName, contents);
