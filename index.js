// Globally available variable to store the current effect
// This abuses javascript's single-threaded nature to store the current effect
let current

function createEffect (fn) {
  // store the passed in function in current, this will be utilized in a moment
  current = fn
  // execute the function, which includes a call to the signal getter
  // which will check for the passed in function in current and add it to the observers list
  fn()
  // reset current to undefined for the next createEffect call
  current = undefined
}

function createSignal (initialValue) {
  let value = initialValue
  const observers = []

  const getter = () => {
    if (current && !observers.includes(current)) {
      observers.push(current)
    }

    return value
  }

  const setter = (newValue) => {
    value = newValue
    // call all observers
    observers.forEach((fn) => fn())
  }

  return [getter, setter]
}

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
