const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
const app = express();
const port = 8080;

const ssl = false; //use http instead of https

app.use(bodyParser.urlencoded({ limit: "100mb", extended: true, useNewUrlParser: true}));
app.use(bodyParser.json({ limit: "100mb", extended: true}));
app.use(require("morgan")("dev"));


app.all("/*", function(req, res, next) {
    next();
});

require("./routes/ats/ats")(app); //ATS Server

if (ssl) {
    const privateKey = fs.readFileSync("privkey.pem", "utf8");
    const certificate = fs.readFileSync("fullchain.pem", "utf8");
    const credentials = {
        "key": privateKey,
        "cert": certificate
    };

    let server = https.createServer(credentials, app);
    server.listen(port);
} else {
    app.listen(port);
}

console.log("API server listening on port " + port + "...");
console.log("SSL: " + ssl);
console.log();