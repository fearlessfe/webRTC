const express = require('express');
const serveIndex = require('serve-index');
const fs = require('fs');
const path = require('path');

const http = require('http');
const https = require('https');

const socketIo = require('socket.io')

const log4js = require('log4js')

const USER_MAX_COUNT = 3;

log4js.configure({
  appenders: {
    file: {
      type: 'file',
      filename: 'app.log',
      layout: {
        type: 'pattern',
        pattern: '%r %p - %m',
      }
    }
  },
  categories: {
    default: {
      appenders: ['file'],
      level: 'debug'
    }
  }
})

const logger = log4js.getLogger();

const app = express();

app.use(serveIndex('./public'));
app.use(express.static('./public'));

const http_server = http.createServer(app);
http_server.listen(3000, '0.0.0.0');

const options = {
  key: fs.readFileSync(path.join(__dirname, './cert/2890117_qiuqiu.site.key')),
  cert: fs.readFileSync(path.join(__dirname, './cert/2890117_qiuqiu.site.pem'))
}
const https_server = https.createServer(options, app);
const io = socketIo.listen(https_server);

io.sockets.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
    const myRoom = io.sockets.adapter.rooms[room];
    var users = myRoom ? Object.keys(myRoom.sockets).length : 0;
    console.log(users);
    logger.log('the number of user in room is:' + users)

    if (users < USER_MAX_COUNT) {
      socket.emit('joined', room, socket.id);

      if (users > 1) {
        socket.to(room).emit('otherjoin', room);
      }
    } else {
      socket.leave(room);
      socket.emit('full', room, socket.id)
    }
    // socket.emit('joined', room, socket.id);

    // io.in(room).emit('joined', room, socket.id);  // 房间内所有人
    // socket.broadcast.emit('joined', room, socket.id);
  })
  socket.on('leave', (room) => {
    const myRoom = io.sockets.adapter.rooms[room];
    var users = Object.keys(myRoom.sockets).length;
    // socket.emit('joined', room, socket.id);
    socket.to(room).emit('bye', room, socket.id);
    // io.in(room).emit('joined', room, socket.id);  // 房间内所有人
    socket.emit('leaved', room, socket.id)
    logger.log('the number of user in room is:' + (users - 1))

    // socket.broadcast.emit('leaved', room, socket.id);
  })
  socket.on('message', (room, data) => {
    io.to(room).emit('message', room, data)
  })
})

https_server.listen(443, '0.0.0.0');
