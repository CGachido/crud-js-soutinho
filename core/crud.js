const fs = require("fs");
const DB_FILE_PATH = "./core/db";

function create(content) {
  fs.writeFileSync(DB_FILE_PATH, content);
  return content;
}

console.log(create("CONTEÚDO"))