const express = require('express');
const fs = require('fs');
const app = express();
const https = require('https');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};
const server = https.createServer(options, app);
const { Server } = require('socket.io');
const io = new Server(server);
var path = require('path');

app.use(express.static(path.join(__dirname, 'client/public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'index.html');
  console.log(__dirname);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id);
});

// optional second argument specifies hostname
server.listen(3000, () => {
  console.log('listening on cassiopeia:3000');
});
