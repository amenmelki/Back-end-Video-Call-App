const signalingController = require('../controllers/signaling');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // WebRTC signaling events
    socket.on('offer', (data) => signalingController.handleOffer(socket, data));
    socket.on('answer', (data) => signalingController.handleAnswer(socket, data));
    socket.on('candidate', (data) => signalingController.handleCandidate(socket, data));

    // Disconnection event
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
