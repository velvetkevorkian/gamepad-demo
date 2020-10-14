import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import Gamepad from './gamepad'

const buttonMap = {
  0: 'a',
  1: 'b',
  2: 'x',
  3: 'y',
  4: 'lb',
  5: 'rb',
  6: 'lt',
  7: 'rt',
  8: 'back',
  9: 'start',
  10: 'ls',
  11: 'rs',
  12: 'up',
  13: 'down',
  14: 'left',
  15: 'right',
}

const App = () => {
  let connectedPad

  function handleGamepadConnected(event) {
    window.removeEventListener('gamepadconnected', handleGamepadConnected)
    connectedPad = event.gamepad
    console.log(`gamepad with id ${connectedPad.id} and ${connectedPad.buttons.length} buttons connected`)
    requestAnimationFrame(poll)
  }

  function poll() {
    const pressedButtons = connectedPad.buttons.map((button, i) => {
      const { pressed } = button
      return {i, pressed}
    }).filter(button => button.pressed)

    if (pressedButtons.length > 0) {
      pressedButtons.forEach(button => console.log(`${buttonMap[button.i]} pressed`))
    }
    requestAnimationFrame(poll)
  }


  useEffect(() => {
    addEventListener('gamepadconnected', handleGamepadConnected)
    return (() => removeEventListener('gamepadconnected', handleGamepadConnected))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="app">
      <Gamepad />
    </div>
  )
}

export default App
