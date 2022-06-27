const users = [];

//addUser,removeUser,getUser,getUsersInRoom

const addUser = ({ id, username, room }) => {
  // Clean the data

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate the data
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  // Check for exitings user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  //Validate username
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  //Store User
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0]; //better than filter stops running when match is found
  }
};

const getUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  return index !== -1 ? users[index] : "no user";
};

const getUsersInRoom = (room) => {
    room = room.tirm().toLowerCase()
  return users.filter((user) => room === user.room);
};



module.exports = {
    addUser,getUser,removeUser,getUsersInRoom
}
