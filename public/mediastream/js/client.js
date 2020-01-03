'use strict'

var videoplay = document.getElementById("player");

function gotMediaStream(stream) {
  videoplay.srcObject = stream;
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
      },
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(gotMediaStream)
      .then(gotDevices)
      .catch(hanleErroe)
  }
}

start();

videoSource.onchange = start;

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

