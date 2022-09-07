const ncc = require("@vercel/ncc");

async function build() {
  console.log(ncc);
  // "ncc": "rimraf ncc && ncc build ./dist/main.js -m -C -o ./ncc",
}

build().catch((e) => {
  console.error(e);
  process.exit(0);
});
