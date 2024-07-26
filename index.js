import { createEffect, createSignal } from './signal.js'

// Setup for the example
// --------------------------------

const [val, setVal] = createSignal(0)
const [count, setCount] = createSignal(0)

function getValueFromSignal () {
  return `value: ${val()}`
}

function AnotherComponent () {
  return {
    click () {
      console.log('clicked')
      setCount(count() + 1)

      // The observers for the signal count() will be called before the next line
      console.log('count updated: ' + count())
    },
  }
}

// Example usage
//
// If the signal setter is called before the createEffect, the value will be updated
// but there won't be any observers to call.
//
// --------------------------------

const clickable = AnotherComponent()
createEffect(() => console.log(count()))
createEffect(() => console.log(getValueFromSignal()))
setVal(1)

clickable.click()
clickable.click()
setVal(2)
clickable.click()
setVal(3)
