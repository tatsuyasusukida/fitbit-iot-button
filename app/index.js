import * as document from 'document'
import * as messaging from 'messaging'
import * as fs from 'fs'
import {vibration} from 'haptics'

const STATE_FILENAME = 'state.json'
const sendButton = document.getElementById('send-button')
const state = loadState(STATE_FILENAME)

console.info(`App loadState: ${JSON.stringify(state)}`)
pushState(state)

messaging.peerSocket.onopen = () => {
  console.info('App Socket Open')
}

messaging.peerSocket.onclose = () => {
  console.info('App Socket Closed')
}

messaging.peerSocket.onmessage = evt => {
  try {
    console.info(`App received: ${JSON.stringify(evt)}`)

    if (evt.data.key === "url" && evt.data.newValue) {
      state.url = JSON.parse(evt.data.newValue).name || ''
    } else if (evt.data.key === "color" && evt.data.newValue) {
      state.color = JSON.parse(evt.data.newValue) || '#5BE37D'
    } else if (evt.data.key === "label" && evt.data.newValue) {
      state.label = JSON.parse(evt.data.newValue).name || 'SEND'
    }
    
    pushState(state)
    saveState(STATE_FILENAME, state)
  } catch (err) {
    console.error(`App onmessage error: ${err.message}`)
  }
}

sendButton.onclick = () => {
  try {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      vibration.start('confirmation')
      const message = {date: new Date().toISOString()}
      messaging.peerSocket.send(message)
      console.info(`App sent: ${JSON.stringify(message)}`)
    } else {
      vibration.start('ping')
      console.error('messaging.peerSocket.readyState !== messaging.peerSocket.OPEN')
    }
  } catch (err) {
    console.error(`App onclick error: ${err.message}`)
  }
}

function loadState (filename) {
  const defaultState = {
    url: '',
    color: '#5BE37D',
    label: 'SEND',
  }

  try {
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'json')
    }
  } catch (err) {
    console.error(`App loadState error: ${err.message}`)
  }
  
  return defaultState
}

function saveState (filename, state) {
  try {
    fs.writeFileSync(filename, state, 'json')
  } catch (err) {
    console.error(`App saveState error: ${err.message}`)
  }
}

function pushState (state) {
  try {
    sendButton.style.fill = state.color

    if (state.url === '') {
      sendButton.text = 'Error: URL is empty'
    } else {
      sendButton.text = state.label
    }
  } catch (err) {
    console.error(`App pushState error: ${err.message}`)
  }
}
