var localvideo = document.querySelector("video#localvideo")
var remotevideo = document.querySelector("video#remotevideo")

var btnStart = document.querySelector("button#start")
var btnCall = document.querySelector("button#call")
var btnHangup = document.querySelector("button#hangup")

var offerText = document.querySelector("textarea#offer")
var answerText = document.querySelector("textarea#answer")

var localStream;  // 添加流时使用
var pc1;  // 发起端
var pc2;

function getMediaStream(stream) {
  localvideo.srcObject = stream;
  localStream = stream;
}

function handleError(err) {
  console.error('Failed to get Media Stream')
}

function handleOfferError(err) {
  console.error('Failed to get Local Offer')
}

function handleAnswerError(err) {
  console.error('Failed to get Local Answer')
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

function getRemoteStream(e) {
  remotevideo.srcObject = e.streams[0];
}

function getOffer(desc) {
  pc1.setLocalDescription(desc);
  offerText.value = desc.sdp;
  // send desc to signal
  // pc2 receive desc from singal

  pc2.setRemoteDescription(desc);

  pc2.createAnswer()
    .then(getAnswer)
    .catch(handleAnswerError);
}

function getAnswer(desc) {
  pc2.setLocalDescription(desc);
  answerText.value = desc.sdp;
  // send desc to signal
  // pc1 receive desc from singal
  pc1.setRemoteDescription(desc);
}

function call() {
  pc1 = new RTCPeerConnection();
  pc2 = new RTCPeerConnection();

  // pc1的candidate需要发送给对方
  pc1.onicecandidate = (e) => {
    pc2.addIceCandidate(e.candidate)
  }

  pc2.onicecandidate = (e) => {
    pc1.addIceCandidate(e.candidate)
  }

  // 将本地采集的流添加到pc1中
  localStream.getTracks().forEach(track => {
    pc1.addTrack(track, localStream)
  })

  pc2.ontrack = getRemoteStream;

  var offerOptions = {
    offerToRecieveAudio: 0,
    offerToRecieveVideo: 1,
  }
  pc1.createOffer(offerOptions)
    .then(getOffer)
    .catch(handleOfferError);

}

function hangup() {
  pc1.close();
  pc2.close();
  pc1 = null;
  pc2 = null;
}

btnStart.onclick = start;
btnCall.onclick = call;
btnHangup.onclick = hangup;
