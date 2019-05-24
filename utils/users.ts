const users: Array<any> = [];

// const user: Object = {
//   room: any
// };
export const addUser = ({
  id,
  username,
  room
}: {
  id: string;
  username: string;
  room: string;
}) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const user = { room, username, id };

  //validate the data
  if (!username || !room) {
    return { error: 'Username and Room are required', user };
  }

  // check for existing user
  const existingUser = users.find(
    u => u.room === room && u.username === username
  );

  // validate usernamme
  if (existingUser) {
    return { error: 'Username is in use!', user };
  }

  //Store user
  users.push(user);
  return { user };
};

export const removeUser = (id: string) => {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1);
  }

  return;
};

export const getUser = (id: string) => users.find(user => user.id === id);

export const getUsersInRoom = (room: String) =>
  users.filter(user => user.room === room);

export default {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
