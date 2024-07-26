export default class XControls extends HTMLElement {
  constructor () {
    super()

    this.props = {
      onIncrement: () => { console.log('increment') },
      onDecrement: () => {},
    }

    this.querySelector('[name="increment"]').addEventListener('click', this.onIncrement)
    this.querySelector('[name="decrement"]').addEventListener('click', this.onDecrement)
  }

  onIncrement () {
    this.props.onIncrement()
  }

  onDecrement () {
    this.props.onDecrement()
  }
}
