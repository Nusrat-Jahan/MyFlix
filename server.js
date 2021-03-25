const http = require("http"),
  url = require("url"),
  fs = require("fs");

http
  .createServer((request, response) => {
    let add = request.url,
      q = url.parse(add, true),
      filePath = "";

    fs.appendFile(
      "log.txt",
      "Url: " + add + "\nTimestamp: " + new Date() + "\n\n",
      err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added to the log");
        }
      }
    );

    if (q.pathname.includes("documentation")) {
      filePath = __dirname + "/documentation.html";
    } else {
      filePath = "index.html";
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });
  })
  .listen(8080);

console.log("My first Node test server is running on Port 8080.");
