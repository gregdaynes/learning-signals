// Globally available variable to store the current effect
// This abuses javascript's single-threaded nature to store the current effect
let current

export function createEffect (fn) {
  // store the passed in function in current, this will be utilized in a moment
  current = fn
  // execute the function, which includes a call to the signal getter
  // which will check for the passed in function in current and add it to the observers list
  fn()
  // reset current to undefined for the next createEffect call
  current = undefined
}

export function createSignal (initialValue) {
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
