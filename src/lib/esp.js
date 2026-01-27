const connectESP = async t => {
  const esploaderMod = await window.esptoolPackage
  if (!esploaderMod || typeof esploaderMod.ESPLoader !== 'function') {
    throw new Error('ESPLoader is not available in esptoolPackage')
  }
  const e = await navigator.serial.requestPort()
  t.log('Connecting...')
  await e.open({
    baudRate: t.baudRate,
  })
  t.log('Connected successfully.')
  return new esploaderMod.ESPLoader(e, t)
}

const formatMacAddr = macAddr => {
  return macAddr
    .map(value => value.toString(16).toUpperCase().padStart(2, '0'))
    .join(':')
}

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const defaultFiles = chipName => {
  //console.log(chipName)

  if (chipName.includes('ESP32')) {
    return [
      { offset: '1000' },
      { offset: '8000' },
      { offset: 'E000' },
      { offset: '10000' },
    ]
  } else {
    return [{ offset: 0 }]
  }
}

const supported = () => {
  return 'serial' in navigator
}

export {
  connectESP,
  formatMacAddr,
  sleep,
  defaultFiles,
  saveFiles,
  loadFiles,
  supported,
}
