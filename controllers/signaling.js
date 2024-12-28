module.exports = {
    handleOffer: (socket, data) => {
      console.log('Offer received:', data);
      socket.broadcast.emit('offer', data); // Broadcast offer to other peers
    },
  
    handleAnswer: (socket, data) => {
      console.log('Answer received:', data);
      socket.broadcast.emit('answer', data); // Broadcast answer to other peers
    },
  
    handleCandidate: (socket, data) => {
      console.log('Candidate received:', data);
      socket.broadcast.emit('candidate', data); // Broadcast ICE candidate
    },
  };
  