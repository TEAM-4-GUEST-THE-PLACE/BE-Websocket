import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8001',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = {
      id: socket.id,
      username,
      room,
    }
    socket.join(user.room)
  });

  socket.on("sendData", (data) => {
    socket.to(data.room).emit("receiveData", data)
  })

});

server.listen(8001, () => {
  console.log('Websocket is running at PORT 8001');
});
