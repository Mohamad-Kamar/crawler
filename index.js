const { createServer } = require("node:http");
const fs = require("fs");
const path = require('node:path'); 

const hostname = "127.0.0.1";

const port = 3000;


const isFile = fileName => fs.lstatSync(fileName).isFile();

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
  }
  else {
    if(isFile(requestPath)){
      fs.readdirSync(folderPath)
        .map(fileName => {
          return path.join(folderPath, fileName);
        })
        .filter(isFile);
      return;
    }

    fs.readFile(`./${requestPath}`, function (err, html) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Path not found");
        return;
      }
      
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(html);
      res.end();
    });
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
