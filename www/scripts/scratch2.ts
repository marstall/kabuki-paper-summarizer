import fs from "node:fs";

const input = fs.readFileSync(0, "utf8").trim(); // fd 0 = stdin
console.error("got:", input);
