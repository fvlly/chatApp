const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log(`A new user connected`);

  socket.emit("message", "Welcome");

  socket.broadcast.emit("message","A new user has joined")

  socket.on("chat", (newMessage) => {
    io.emit("message", newMessage);
  });

  socket.on('sendLocation',(coords)=>{
    io.emit('message',`https://google.com/maps?=${coords.lat},${coords.long}`)
  })

  socket.on('disconnect',()=>{
    io.emit('message','A user just left')
      })
});

server.listen(PORT, () => console.log(`App is running on port ${PORT}`));
