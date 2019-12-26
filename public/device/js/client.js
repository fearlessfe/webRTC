if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log('enumerateDevices is not supports')
} else {
  navigator.mediaDevices.enumerateDevices()
    .then(getDevices)
    .catch(handleError)
}

function getDevices(deviceInfos) {
  deviceInfos.forEach(deviceInfo => {
    console.log(`${deviceInfo.kind}: label=${deviceInfo.label}: id=${deviceInfo.deviceId}: groupId=${deviceInfo.groupId}`)
  })
}

function handleError(err) {
  console.log(err.name + '' + err.message);
}