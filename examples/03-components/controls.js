export default class XControls extends HTMLElement {
  constructor () {
    super()

    this.querySelector('[name=increment]').addEventListener('click', this.onIncrement)
    this.querySelector('[name=decrement]').addEventListener('click', this.onDecrement)

    this.onIncrement = this.onIncrement.bind(this)
    this.onDecrement = this.onDecrement.bind(this)
  }

  onIncrement (event) {
    this.dispatchEvent(new CustomEvent('x-increment', {
      bubbles: true,
      composed: true,
    }))
  }

  onDecrement (event) {
    this.dispatchEvent(new CustomEvent('x-decrement', {
      bubbles: true,
      composed: true,
    }))
  }
}
