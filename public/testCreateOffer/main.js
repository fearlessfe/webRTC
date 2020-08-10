const btn = document.getElementById('createOffer')

const pc = new RTCPeerConnection()
const pc2 = new RTCPeerConnection()

function getAnswer(desc) {
  console.log(desc.sdp);
  pc2.setLocalDescription(desc);
  pc.setRemoteDescription(desc);
}

function getOffer(desc) {
  console.log(desc.sdp);

  pc.setLocalDescription(desc);

  pc2.setRemoteDescription(desc);

  pc2.createAnswer().then(getAnswer).catch(handleError)
}

function getMediaStream(stream) {
  stream.getTracks().forEach(track => {
    pc.addTrack(track);
  })

  const options = {
    offerToReceiveAudio: 0,
    offerToReceiveVideo: 0,
    iceRestart: false
  }
  pc.createOffer(options).then(getOffer).catch(handleError)
}

function handleError(err) {
  console.error('Failed to get Media Stream:', err);
}

function getStream() {
  const constraints = {
    audio: false,
    video: true
  }

  navigator.mediaDevices.getUserMedia(constraints).then(getMediaStream).catch(handleError)
}

function test() {
  if (!pc) {
    console.error('pc is null');
    return
  }
  getStream();
  return
}

btn.onclick = test;