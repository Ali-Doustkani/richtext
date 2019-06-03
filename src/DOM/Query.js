function el(element) {
  if (!element) {
    return null
  }
  if (typeof element === 'string') {
    return new QueryElement(document.createElement(element))
  }
  if (element instanceof Node) {
    return new QueryElement(element)
  }
  throw new Error('Unsupported type to wrap')
}

el.active = function() {
  return el(document.activeElement)
}

class QueryElement {
  constructor(element) {
    this.element = element
  }
  append(child) {
    if (!child) {
      return this
    }

    if (typeof child === 'string') {
      const text = this.element.lastChild
      if (text && text.nodeType === Node.TEXT_NODE) {
        text.data += child
      } else {
        this.element.appendChild(document.createTextNode(child))
      }
    } else {
      this.element.appendChild(child.element)
    }

    return this
  }

  appendTo(target) {
    target.append(this)
    return this
  }

  val(value) {
    if (value === undefined) {
      return this.element.textContent
    }
    this.element.innerHTML = ''
    if (!value) {
      return this
    }
    if (typeof value === 'string') {
      this.element.appendChild(document.createTextNode(value))
    } else if (value instanceof QueryElement) {
      this.append(value)
    } else {
      throw new Error('Unsupported value')
    }
    return this
  }

  replace(newChild, oldChild) {
    this.element.replaceChild(newChild.element, oldChild.element)
    return this
  }

  insertAfter(base, newChild) {
    if (Array.isArray(newChild)) {
      newChild
        .reverse()
        .forEach(child =>
          this.element.insertBefore(child.element, base.element.nextSibling)
        )
    } else {
      this.element.insertBefore(newChild.element, base.element.nextSibling)
    }
    return this
  }

  remove(child) {
    if (Array.isArray(child)) {
      child.forEach(item => this.element.removeChild(item.element))
    } else {
      this.element.removeChild(child.element)
    }
    return this
  }

  className(classname) {
    this.element.className = classname
    return this
  }

  setClassFrom(obj) {
    if (obj && obj.className) {
      this.element.className = obj.className
    }
    return this
  }

  hasClassFrom(obj) {
    return this.element.className || obj.className
      ? obj.className === this.element.className
      : true
  }

  is(target) {
    if (typeof target === 'string') {
      return this.element.tagName === target.toUpperCase()
    }
    if (typeof target === 'number') {
      return this.element.nodeType === target
    }
    if (target instanceof QueryElement) {
      return this.element === target.element
    }
    if (target instanceof Node) {
      return this.element === target
    }
    throw new Error('Unsupported type for comparing')
  }

  isNot(type) {
    return !this.is(type)
  }

  isEditable() {
    this.element.contentEditable = true
    return this
  }

  parent() {
    return el(this.element.parentNode)
  }

  child(index) {
    return el(this.element.childNodes[index])
  }

  firstChild() {
    return el(this.element.firstChild)
  }

  lastChild() {
    return el(this.element.lastChild)
  }

  nextSibling() {
    return el(this.element.nextSibling)
  }

  previousSibling() {
    return el(this.element.previousSibling)
  }

  hasChildren() {
    return Boolean(this.element.childNodes.length)
  }

  hasNoChildren() {
    return !this.hasChildren()
  }

  get length() {
    return this.element.textContent.length
  }
}

export { el }
