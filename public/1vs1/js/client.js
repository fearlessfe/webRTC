const localVideo = document.querySelector('video#localvideo')
const remoteVideo = document.querySelector('video#remoteVideo')

const btnConn = document.getElementById('connserver')
const btnLeave = document.getElementById('leave')

let localStream = null;

const roomId = '111111';

let socket, pc;

let state = 'init';

function sendMessage(roomid, data) {
  console.log('send p2p message', roomid, data)
  if (socket) {
    socket.emit('message', roomid, data)
  }
}

function getAnswer(desc) {
  pc.setLocalDescription(desc);
  sendMessage(roomId, desc);
}

function handleAnswerError(err) {
  console.log('Failed to get Answer', err)
}

function handleOfferError(err) {
  console.log('Failed to get Offer', err)
}

function getOffer(desc) {
  pc.setLocalDescription(desc);
  sendMessage(roomId, desc);
}

function call() {
  if (state === 'joined_conn') {
    if (pc) {
      const options = {
        offerToReceiveVideo: 1,
        offerToReceiveAudio: 0,
      }
      pc.createOffer(options)
        .then(getOffer)
        .catch(handleOfferError)
    }
  }
}





function conn() {
  socket = io.connect();

  socket.on('joined', (roomid, id) => {
    console.log('receive joined msg:', roomid, id)
    state = 'joined';

    createPeerConnection();

    btnConn.disabled = true;
    btnLeave.disabled = false;
    console.log('receive joined msg: state = ', state)
  })

  socket.on('otherjoin', (roomid, id) => {
    console.log('receive otherjoin msg:', roomid, id)

    if (state === 'joined_unbind') {
      createPeerConnection();
    }
    state = 'joined_conn';
    // 媒体协商
    call()
    console.log('receive otherjoin msg: state = ', state);
  })

  socket.on('full', (roomid, id) => {
    console.log('receive full msg:', roomid, id)
    state = 'leaved'
    socket.disconnect();
    console.log('receive full msg: state = ', state)
    alert('the room is full')
    btnConn.disabled = false;
    btnLeave.disabled = true;
  })

  socket.on('leaved', (roomid, id) => {
    console.log('receive leaved msg:', roomid, id)
    state = 'leaved'
    socket.disconnect();
    console.log('receive leaved msg: state = ', state)
    btnConn.disabled = false;
    btnLeave.disabled = true;
  })

  socket.on('bye', (roomid, id) => {
    console.log('receive bye msg:', roomid, id)
    state = 'joined_unbind'
    closePeerConnection();
    console.log('receive bye msg: state = ', state)
  })

  socket.on('message', (roomid, data) => {
    console.log('receive message msg:', roomid, data)
    // 媒体协商
    if (data) {
      if (data.type === 'offer') {
        pc.setRemoteDescription(new RTCSessionDescription(data));
        console.log('success set remote desc')
        pc.createAnswer().then(getAnswer).catch(handleAnswerError)
      } else if (data.type === 'answer') {
        pc.setRemoteDescription(new RTCSessionDescription(data))
        console.log('success set remote desc')
      } else if (data.type === 'candidate') {
        const candidate = new RTCIceCandidate({
          sdpMLineIndex: data.label,
          candidate: data.candidate
        });
        console.log(candidate)
        pc.addIceCandidate(candidate)
      } else {
        console.error('the message data is invalid', data)
      }

    }
  })

  socket.emit('join', roomId);
  return;
}

function getMediaStream(stream) {
  localvideo.srcObject = stream;
  localStream = stream;
  conn();
}

function handleError(err) {
  console.log(err)
  console.error('Failed to get Media Stream')
}

function start() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.error('the getUserMedia is not supported')
    return;
  }
  var constraints = {
    video: true,
    audio: false
  }
  navigator.mediaDevices.getUserMedia(constraints)
    .then(getMediaStream)
    .catch(handleError)
}

function connSignalServer() {
  start()
}

function closeLocalMedia() {
  if (localStream && localStream.getTracks()) {
    localStream.getTracks().forEach((track) => {
      track.stop();
    })
  }
  localStream = null;
}


function leave() {
  if (socket) {
    socket.emit('leave', roomId)
  }

  closePeerConnection();
  closeLocalMedia();

  btnConn.disabled = false;
  btnLeave.disabled = true;
}

function createPeerConnection() {
  console.log('create RTCPeerConnection');
  if (!pc) {
    const pcConfig = {
      iceServers: [
        {
          urls: 'stun:qiuqiu.site:3478',
          credential: 'password',
          username: 'admin'
        }
      ]
    }
    pc = new RTCPeerConnection(pcConfig);

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        console.log('find candidate ', e.candidate)
        sendMessage(roomId, {
          type: 'candidate',
          label: e.candidate.sdpMLineIndex,
          id: e.candidate.sdpMid,
          candidate: e.candidate.candidate
        })
      }
    }

    pc.ontrack = e => {
      remoteVideo.srcObject = e.streams[0]
    }
  }

  if (localStream) {
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track);
    })
  }
}

function closePeerConnection() {
  console.log('close RTCPeerConnection');
  if (pc) {
    pc.close();
    pc = null;
  }
  closeLocalMedia();
}


btnConn.onclick = connSignalServer
btnLeave.onclick = leave
