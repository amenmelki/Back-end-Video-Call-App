module.exports = {
    handleOffer: (socket, data) => {
      console.log('Offer received:', data);
      socket.broadcast.emit('offer', data); 
    },
  
    handleAnswer: (socket, data) => {
      console.log('Answer received:', data);
      socket.broadcast.emit('answer', data); 
    },
  
    handleCandidate: (socket, data) => {
      console.log('Candidate received:', data);
      socket.broadcast.emit('candidate', data);
    },
  };
  
