const users = [];

// Join user to chat
function userJoin(id, username) {
  const user = { id, username };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// user leaves
function userLeave(id, username) {
  const user = { id, username };

  users.filter((user) => user.id != id);

  return user;
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
};
