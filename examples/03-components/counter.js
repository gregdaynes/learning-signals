export default class XCounter extends HTMLElement {
  constructor () {
    super()

    this.props = {
      value: 0,
    }
  }

  connectedCallback () {
    // ensure any initial properties set before the component was initialised our passed
    // through our setters
    Object.keys(this.props).forEach((propName) => {
      if (this.hasOwnProperty(propName)) {
        const value = this[propName]

        delete this[propName]

        this[propName] = value
      }
    })

    this.updateChildren()
  }

  set value (value) {
    this.props.value = value

    this.updateChildren()
  }

  get value () {
    return this.props.total
  }

  updateChildren () {
    this.innerText = this.props.value
  }
}
