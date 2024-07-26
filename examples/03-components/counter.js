export default class XCounter extends HTMLElement {
  constructor () {
    super()

    this.props = {
      value: 0,
    }
  }

  connectedCallback () {
    // ensure any initial properties set before the component was 
    // initialized, are run through the setters. This will trigger
    // the render method to update the component.
    Object.keys(this.props).forEach((propName) => {
      if (this.hasOwnProperty(propName)) {
        const value = this[propName]

        delete this[propName]

        this[propName] = value
      }
    })
  }

  set value (value) {
    this.props.value = value

    this.render()
  }

  get value () {
    return this.props.total
  }

  render () {
    this.innerText = this.props.value
  }
}
