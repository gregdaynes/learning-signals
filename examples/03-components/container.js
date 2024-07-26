import { createSignal, createEffect } from '../../signal.js'

export default class XContainer extends HTMLElement {
  constructor () {
    super()

    const [value, setValue] = createSignal(0)

    this.counter = this.querySelector('x-counter')
    this.controls = this.querySelector('x-controls')

    this.state = {
      value,
      setValue,
    }

    createEffect(() => {
      this.render()
    })
  }

  connectedCallback () {
    this.controls.onIncrement = this.onIncrement.bind(this)
    this.controls.onDecrement = this.onDecrement.bind(this)

    this.render()
  }

  onDecrement (event) {
    this.state.setValue(this.state.value() - 1)
  }

  onIncrement (event) {
    this.state.setValue(this.state.value() + 1)
  }

  render () {
    this.counter.value = this.state.value()
  }
}
