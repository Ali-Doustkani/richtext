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

QueryElement.prototype.appendTo = function(target) {
  target.append(this)
  return this
}

QueryElement.prototype.val = function(value) {
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

QueryElement.prototype.className = function(classname) {
  this.element.className = classname
  return this
}

QueryElement.prototype.setClassFrom = function(obj) {
  if (obj && obj.className) {
    this.element.className = obj.className
  }
  return this
}

QueryElement.prototype.hasClassFrom = function(obj) {
  return this.element.className || obj.className
    ? obj.className === this.element.className
    : true
}

QueryElement.prototype.is = function(type) {
  if (typeof type === 'string') {
    return this.element.tagName === type.toUpperCase()
  }
  if (typeof type === 'number') {
    return this.element.nodeType === type
  }
  throw new Error('Unsupported type for comparing')
}

QueryElement.prototype.isEditable = function() {
  this.element.contentEditable = true
  return this
}

QueryElement.prototype.firstChild = function() {
  return el(this.element.firstChild)
}

QueryElement.prototype.nextSibling = function() {
  return el(this.element.nextSibling)
}

export { el }
