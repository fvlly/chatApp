const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log(`A new user connected`);

  socket.on("join", ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit("message", generateMessage('Admin',"Welcome"));
    socket.broadcast
      .to(room)
      .emit("message", generateMessage("Admin",`${user.username} has joined`));

      callback()
  });

  socket.on("sendMessage", (newMessage) => {
    const {username,room} = getUser(socket.id)

    io.to(room).emit("message", generateMessage(username,newMessage));
  });

  socket.on("sendLocation", (coords, callback) => {
    
  const user = getUser(socket.id)

    io.to(user.room).emit(
      "locationMessage",
      generateLocationMessage(
        user.username,`https://google.com/maps?=${coords.lat},${coords.long}`
      )
    );
    callback();
  });

  socket.on("disconnect", () => {

    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit("message", generateMessage(user.username + " just left"));
    }

    
  });
});

server.listen(PORT, () => console.log(`App is running on port ${PORT}`));
