'use strict'

var videoplay = document.getElementById("player");

var audioSource = document.querySelector("select#audioSource")
var audioOutput = document.querySelector("select#audioOutput")
var videoSource = document.querySelector("select#videoSource")
var filter = document.querySelector("select#filter")

var constraints = document.getElementById("constraints");

var recvideo = document.getElementById("recplayer");
var btnRecord = document.getElementById("record");
var btnPlay = document.getElementById("recplay");
var btnDownload = document.getElementById("download");

var buffer = [];
var mediaRecorder;

function gotMediaStream(stream) {
  videoplay.srcObject = stream;
  window.stream = stream;
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  deviceInfos.forEach(deviceInfo => {
    console.log(`kind=${deviceInfo.kind}: label=${deviceInfo.label}: id=${deviceInfo.deviceId}: groupId=${deviceInfo.groupId}`);
    var option = document.createElement('option');
    option.text = deviceInfo.label;
    option.value = deviceInfo.deviceId;
    if(deviceInfo.kind === 'audioinput') {
      audioSource.appendChild(option); 
    } else if(deviceInfo.kind === 'audiooutput') {
      audioOutput.appendChild(option)
    } else if(deviceInfo.kind === 'videoinput') {
      videoSource.appendChild(option);
    }
  })
}

function hanleErroe(err) {
  console.log('getUserMedia error: ', err);
}

function start() {
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia is not supported!')
  } else {
    var deviceId = videoSource.value;
    var constraints = {
      video: {
        width: 640,
        height: 480,
        frameRate: {
          min: 20,
          max: 30
        },
        devicdId : deviceId || undefined
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(gotMediaStream)
      .then(gotDevices)
      .catch(hanleErroe)
  }
}

start();

videoSource.onchange = start;
filter.onchange = function() {
  videoplay.className = filter.value;
}


function handleDataAvailable(e) {
  if(e && e.data && e.data.size > 0) {
    buffer.push(e.data);
  }
}

function startRecord() {
  var options = {
    mimeType: 'video/webm;codecs=vp8'
  }

  if(!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.error(`${options.mimeType} is not supported`)
    return 
  }
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (error) {
    console.error('Fail to create MediaRecorder:', error);
    return;
  }
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10);
}

function stopRecord() {
  mediaRecorder.stop();
}

btnRecord.onclick = function() {
  if(btnRecord.textContent === 'start record') {
    startRecord();
    btnRecord.textContent = 'stop record';
    btnPlay.disabled = false;
    btnDownload.disabled = false;
  } else {
    stopRecord();
    btnRecord.textContent === 'start record';
    // btnPlay.disabled = true;
    // btnDownload.disabled = true;
  }
}

btnPlay.onclick = function() {
  var blob = new Blob(buffer, {type: 'video/webm'});
  recvideo.src = window.URL.createObjectURL(blob);
  recvideo.srcObject = null;
  recvideo.controls = true;
  recvideo.play();
}

btnDownload.onclick = function() {
  var blob = new Blob(buffer, {type: 'video/webm'});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');

  a.href = url;
  a.style.display = 'none';
  a.download = 'aaa.webm';
  a.click();
}
// video constrain
// height 视频高
// width  视频宽
// aspectRatio = width / height   比例 一般不设置
// frameRate  帧率  fps
// facingMode  摄像头方向
//    user  前置摄像头
//    environment  后置摄像头
//    left  前置左侧摄像头
//    right  前置右侧摄像头

// audio constrain
// volume 音量 0-1
// sampleRate  采样率
// sampleSize  采样大小 一般两个字节，16位
// echoCancellation  回音消除 boolean
// autoGainControl  音量增益  boolean
// noiseSuppression  降噪
// latency  延迟
// channelCount  单声道或双声道
// deviceId 切换设备
// groupID  设备组

