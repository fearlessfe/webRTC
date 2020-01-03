const express = require('express');
const serveIndex = require('serve-index');
const fs = require('fs');
const path = require('path');

const http = require('http');
const https = require('https');

const app = express();

app.use(serveIndex('./public'));
app.use(express.static('./public'));

const http_server = http.createServer(app);
http_server.listen(3000, '0.0.0.0');

const options = {
  key:  fs.readFileSync(path.join(__dirname,'./cert/2890117_qiuqiu.site.key')),
  cert:  fs.readFileSync(path.join(__dirname,'./cert/2890117_qiuqiu.site.pem'))
}
const https_server = https.createServer(options, app);
https_server.listen(443, '0.0.0.0');
