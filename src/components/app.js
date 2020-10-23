import { h } from 'preact'
import { useEffect, useState, useRef } from 'preact/hooks'
import Gamepad from './gamepad'

const buttons = ['a', 'b', 'x', 'y', 'lb', 'rb', 'lt', 'rt', 'back', 'start', 'ls', 'rs', 'up', 'down', 'left', 'right']
const buttonMap = {}
buttons.forEach((b, i) => buttonMap[i] = b)

const App = () => {
  let connectedPad = useRef()
  let gamepadStateRef = useRef()
  const [gamepadState, setGamepadState] = useState(null)

  useEffect(() => {
    const initialGamepadState = {}
    buttons.forEach((b) => initialGamepadState[b] = false)
    gamepadStateRef.current = initialGamepadState

    addEventListener('gamepadconnected', handleGamepadConnected)
    return (() => removeEventListener('gamepadconnected', handleGamepadConnected))
  }, [])

  function handleGamepadConnected(event) {
    window.removeEventListener('gamepadconnected', handleGamepadConnected)
    connectedPad.current = event.gamepad
    requestAnimationFrame(poll)
  }

  function poll() {
    const newState = {}
    let stateHasChanged = false
    connectedPad.current.buttons.forEach((button, i) => {
      const buttonName = buttonMap[i]
      if (!buttonName) return
      const { pressed } = button
      newState[buttonName] = pressed
      if (gamepadStateRef.current[buttonName] !== pressed) stateHasChanged = true
    })

    if(stateHasChanged) {
      gamepadStateRef.current = newState
      setGamepadState(() => newState)
    }
    requestAnimationFrame(poll)
  }

  return (
    <div id="app">
      <Gamepad gamepadState={gamepadState} />
    </div>
  )
}

export default App
