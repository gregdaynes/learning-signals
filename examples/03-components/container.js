export default class XContainer extends HTMLElement {
  constructor () {
    super()

    this.state = {
      value: 0,
    }

    this.addEventListener('x-increment', this.onIncrement)
    this.addEventListener('x-decrement', this.onDecrement)
    this.addEventListener('x-update-amount', this.onUpdateAmount)
  }

  connectedCallback () {
    this.updateChildren()
  }

  onDecrement (event) {
    this.state.value = this.state.value - 1

    this.updateChildren()
  }

  onIncrement (event) {
    this.state.value = this.state.value + 1

    this.updateChildren()
  }

  updateChildren () {
    this.querySelector('x-counter').value = this.state.value
  }
}
