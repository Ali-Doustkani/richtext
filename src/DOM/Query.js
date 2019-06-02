function el(element) {
  if (!element) {
    return null
  }
  if (typeof element === 'string') {
    return new QueryElement(document.createElement(element))
  }
  return new QueryElement(element)
}

function QueryElement(element) {
  this.element = element
}

QueryElement.prototype.append = function(child) {
  if (!child) {
    return this
  }

  if (typeof child === 'string') {
    const text = this.element.firstChild
    if (text && text.nodeType !== Node.TEXT_NODE) {
      throw new Error('This element is not a text element')
    }
    if (text) {
      text.data += child
    } else {
      this.element.appendChild(document.createTextNode(child))
    }
  } else {
    this.element.appendChild(child.element)
  }

  return this
}

QueryElement.prototype.appendTo = function(target) {
  target.append(this)
  return this
}

QueryElement.prototype.val = function(value) {
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

QueryElement.prototype.replace = function(newChild, oldChild) {
  this.element.replaceChild(newChild.element, oldChild.element)
  return this
}

QueryElement.prototype.insertAfter = function(base, newChild) {
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

QueryElement.prototype.remove = function(child) {
  this.element.removeChild(child.element)
  return this
}

QueryElement.prototype.setClassFrom = function(obj) {
  if (obj && obj.className) {
    this.element.className = obj.className
  }
  return this
}

QueryElement.prototype.isEditable = function() {
  this.element.contentEditable = true
  return this
}

export { el }
