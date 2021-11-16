let users = [];

const getUser = (id) => {
  return users.find(user => user.id === id);
};

const addUser = ({ id, name, room }) => {
  !users.some(user => user.name === name && user.room === room) && users.push({ id, name, room });
};

const removeUser = (id) => {
  const removedUser = getUser(id);

  users = users.filter(user => user.id !== id);

  return removedUser;
};

const updateUserTyping = (id, isTyping) => {
  const user = getUser(id);

  if(user && user.isTyping !== isTyping) {
    user.isTyping = isTyping;
  }

  return user;
};

const getUsersInRoom = (room) => {
  return users.filter(user => user.room === room);
};

module.exports = { getUser, addUser, removeUser, updateUserTyping, getUsersInRoom };
