const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html'); // Serve the frontend
});

// Socket.IO signaling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Relay signaling data between clients
  socket.on('offerOrAnswer', (data) => {
    socket.broadcast.emit('offerOrAnswer', data);
  });

  socket.on('candidate', (data) => {
    socket.broadcast.emit('candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
