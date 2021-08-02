const express = require('express');
// const fs = require('fs');
const app = express();
const http = require('http');
// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem'),
// };
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  console.log(__dirname);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  console.log(socket.id);
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
