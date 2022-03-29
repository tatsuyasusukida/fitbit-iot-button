import * as messaging from "messaging"
import {settingsStorage} from "settings"

messaging.peerSocket.onopen = () => {
  console.log("Companion Socket Open");
  restoreSettings()
}

messaging.peerSocket.onclose = () => {
  console.log("Companion Socket Closed")
}

messaging.peerSocket.onmessage = async (evt) => {
  try {
    console.info(`Companion received: ${JSON.stringify(evt)}`)
    
    const settingMethod = settingsStorage.getItem('method')
    const settingUrl = settingsStorage.getItem('url')
    const settingBody = settingsStorage.getItem('body')
    const settingHeaders = settingsStorage.getItem('headers')

    const method = settingMethod && JSON.parse(settingMethod).name || 'POST'
    const url = settingUrl && JSON.parse(settingUrl).name || ''
    const body = settingBody && JSON.parse(settingBody).name || ''
    const headers = JSON.parse(settingHeaders || '[]')
      .map(header => {
        const pieces = header.name.split(':')
        const key = pieces[0]
        const value = pieces.slice(1).join(':').trim()
        return {key, value}
      })
      .reduce((memo, header) => {
        memo[header.key] = header.value
        return memo
      }, {})

    console.info(`Companion fetch request: ${JSON.stringify({method, url, headers, body})}`)
    
    if (url !== '') {
      const response = await fetch(url, {method, headers, body})
      
      if (response.status < 200 || 300 <= response.status) {
        console.warn(`Companion fetch response: ${JSON.stringify(response)}`)
      }
    }
  } catch (err) {
    console.error(`Companion fetch error: ${err.message}`)
  }
}

settingsStorage.onchange = evt => {
  const data = {
    key: evt.key,
    newValue: evt.newValue,
  }
  sendVal(data)
}

function restoreSettings() {
  const keys = ['url', 'color', 'label']
  for (const key of keys) {
    const newValue = settingsStorage.getItem(key)
    sendVal({key, newValue})
  }
}

function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data)
  }
}
