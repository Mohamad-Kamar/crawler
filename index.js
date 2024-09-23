const { createServer } = require("node:http");
const fs = require("fs");
const path = require("node:path");

const hostname = "127.0.0.1";

const port = 3000;

const isFile = (fileName, cb) => {
  fs.lstat(fileName, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    if (stats.isFile()) {
      console.log("File");
      cb(true);
    } else if (stats.isDirectory()) {
      console.log("Directory");
      cb(false);
    } else {
      console.log("Something else");
    }
  });
};

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const requestPath = req.url;
  if (requestPath === "/") {
    fs.readFile("./index.html", function (err, html) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
    });
    return;
  } else {
    console.log({ requestPath });
    isFile(requestPath, (isFile, err) => {
      if (isFile) {
        res.write(
          JSON.stringify({
            files: [],
            folders: [],
        })
      );
        res.end();
      } else {
        const folders = fs
          .readdirSync(requestPath)
          .map((fileName) => {
            return path.join(requestPath, fileName);
          })
          .filter(isFile);
        console.log({ folders });
      }
    });
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
