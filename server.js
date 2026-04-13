const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile("./index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } 
  else if (req.url === "/upload" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      const base64 = body.replace(/^data:image\/png;base64,/, "");
      const fileName = "photo_" + Date.now() + ".png";

      fs.writeFileSync("./uploads/" + fileName, base64, "base64");

      res.end("ok");
    });
  } 
  else if (req.url === "/images") {
    const files = fs.readdirSync("./uploads");
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(files));
  } 
  else if (req.url.startsWith("/uploads/")) {
    const filePath = "." + req.url;
    const file = fs.readFileSync(filePath);
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(file);
  } 
  else if (req.url === "/admin") {
    fs.readFile("./admin.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server running"));