const socket = io(); // Connect to the server

let localStream;
let peerConnection;
const config = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, // Public STUN server
  ],
};

// Get local media (camera/microphone)
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localStream = stream;
    document.getElementById('localVideo').srcObject = stream;
  })
  .catch((error) => console.error('Error accessing media devices:', error));

// Handle signaling
socket.on('signal', async (data) => {
  if (data.type === 'offer') {
    // Create a peer connection
    peerConnection = new RTCPeerConnection(config);
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
    
    // Handle incoming ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', {
          type: 'candidate',
          candidate: event.candidate,
          to: data.from,
        });
      }
    };

    // Set the remote description
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    
    // Create and send an answer
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('signal', {
      type: 'answer',
      answer,
      to: data.from,
    });
  } else if (data.type === 'answer') {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
  } else if (data.type === 'candidate') {
    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
  }
});

// Start the call
document.getElementById('callButton').addEventListener('click', async () => {
  // Create a peer connection
  peerConnection = new RTCPeerConnection(config);
  localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));
  
  // Handle outgoing ICE candidates
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('signal', {
        type: 'candidate',
        candidate: event.candidate,
        to: 'peer-id',
      });
    }
  };

  // Create and send an offer
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('signal', {
    type: 'offer',
    offer,
    to: 'peer-id',
  });
});
