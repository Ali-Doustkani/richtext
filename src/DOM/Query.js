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
    } else if (Array.isArray(child)) {
      child.forEach(c => this.element.appendChild(c.element))
    } else {
      this.element.appendChild(child.element)
    }

    return this
  }

  appendTo(target) {
    target.append(this)
    return this
  }

  shift(children) {
    this.element.insertBefore(children.element, this.element.firstChild)
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

  insertBefore(base, newChild) {
    if (Array.isArray(newChild)) {
      newChild.forEach(child =>
        this.element.insertBefore(child.element, base.element)
      )
    } else {
      this.element.insertBefore(newChild.element, base.element)
    }
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
    if (child === undefined) {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element)
      }
    } else if (Array.isArray(child)) {
      child.forEach(item => this.element.removeChild(item.element))
    } else {
      this.element.removeChild(child.element)
    }
    return this
  }

  moveChildrenTo(targetParent) {
    while (this.element.childNodes.length) {
      targetParent.element.append(this.element.firstChild)
    }
    return this
  }

  splitFrom(child) {
    const result = []
    const fromIndex = [...this.element.childNodes].indexOf(child.element)
    while (this.element.childNodes.length > fromIndex) {
      result.push(el(this.element.childNodes[fromIndex]))
      this.element.removeChild(this.element.childNodes[fromIndex])
    }
    return result
  }

  to(target) {
    const targetEl = document.createElement(target)
    if (this.element.parentNode) {
      this.element.parentNode.replaceChild(targetEl, this.element)
    }
    while (this.element.childNodes.length) {
      targetEl.appendChild(this.element.childNodes[0])
    }
    this.element = targetEl
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

  count() {
    return this.element.childNodes.length
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

  next() {
    return el(this.element.nextSibling)
  }

  previous() {
    return el(this.element.previousSibling)
  }

  nextIs(target) {
    return this.next() && this.next().is(target)
  }

  previousIs(target) {
    return this.previous() && this.previous().is(target)
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
