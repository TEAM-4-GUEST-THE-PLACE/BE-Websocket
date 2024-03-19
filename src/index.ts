import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
app.use(cors());

interface IUsers {
  id: string;
  username: string;
  room: string;
}

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let users: IUsers[] = [];
let countDown: any;
const second = 30;

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username }) => {
    if (users.length < 5) {
      const user = {
        id: socket.id,
        username,
        room: '1',
      };
      users.push(user);
      socket.join(user.room);
      console.log(socket.rooms);
    } else if (users.length > 5 && users.length < 10) {
      const user = {
        id: socket.id,
        username,
        room: '2',
      };
      users.push(user);
      socket.join(user.room);
      console.log(socket.rooms);
    }
    socket.broadcast.emit('usersList', users);
    socket.emit('usersList', users);
  });

  socket.on('endRoom', (data) => {
    users.splice(users.indexOf(data), 1);
    socket.broadcast.emit('usersList', users);
    socket.emit('usersList', users);
  });

  socket.on('sendData', (data) => {
    socket.to(data.room).emit('receiveData', data);
  });
});

server.listen(8001, () => {
  console.log('Websocket is running at PORT 8001');
});
