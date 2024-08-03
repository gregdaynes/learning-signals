let currentCallback
let batchQueue
let batchDepth = 0
let untrackedCallback

class Effect {
  constructor (callback) {
    currentCallback = callback
    callback()
    currentCallback = undefined
  }
}

class Computed {
  #callback

  constructor (callback) {
    currentCallback = callback
    this.#callback = callback
    this.#callback()
    currentCallback = undefined
  }

  get value () {
    return this.#callback()
  }
}

class Signal {
  #value
  #observers = new Set()

  constructor (initialValue) {
    this.#value = initialValue
  }

  get value () {
    return this.#get()
  }

  set value (newValue) {
    return this.#set(newValue)
  }

  peek () {
    return this.#value
  }

  #get () {
    if (currentCallback && !untrackedCallback) {
      this.#observers.add(currentCallback)
    }

    return this.#value
  }

  #set (newValue) {
    this.#value = newValue

    if (batchQueue) {
      this.#observers.forEach((fn) => batchQueue.add(fn))
    } else {
      this.#observers.forEach((fn) => fn())
    }
  }
}

class Batch {
  constructor (callback, name) {
    batchDepth = batchDepth + 1

    if (!batchQueue) {
      batchQueue = new Set()
    }

    callback()

    batchDepth = batchDepth - 1

    if (batchDepth === 0) {
      batchQueue.forEach((fn) => fn())
      batchQueue = undefined
    }
  }
}

export function untracked (callback) {
  untrackedCallback = callback
  const results = callback()
  untrackedCallback = undefined

  return results
}

export const signal = (initialValue) => new Signal(initialValue)
export const effect = (callback) => new Effect(callback)
export const computed = (callback) => new Computed(callback)
export const batch = (callback, name) => new Batch(callback, name)
