function el(element) {
  if (!element) {
    return null
  }
  if (typeof element === 'string') {
    return new ElementWrapper(document.createElement(element))
  }
  return new ElementWrapper(element)
}

function ElementWrapper(element) {
  this.element = element
}

ElementWrapper.prototype.append = function(child) {
  if (child) {
    this.element.appendChild(child.element)
  }
  return this
}

ElementWrapper.prototype.appendTo = function(target) {
  target.append(this)
  return this
}

ElementWrapper.prototype.val = function(value) {
  this.element.innerHTML = ''
  if (!value) {
    return this
  }
  if (typeof value === 'string') {
    this.element.appendChild(document.createTextNode(value))
  } else if (value instanceof ElementWrapper) {
    this.append(value)
  } else {
    throw new Error('Unsupported value')
  }
  return this
}

ElementWrapper.prototype.appendText = function(value) {
  if (!value) {
    return this
  }
  const text = this.element.firstChild
  if (text && text.nodeType !== Node.TEXT_NODE) {
    throw new Error('This element is not a text element')
  }
  if (text) {
    text.data += value
  } else {
    this.element.appendChild(document.createTextNode(value))
  }
  return this
}

ElementWrapper.prototype.replace = function(newChild, oldChild) {
  this.element.replaceChild(newChild.element, oldChild.element)
  return this
}

ElementWrapper.prototype.insertAfter = function(base, newChild) {
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

ElementWrapper.prototype.remove = function(child) {
  this.element.removeChild(child.element)
  return this
}

ElementWrapper.prototype.setClassFrom = function(obj) {
  if (obj && obj.className) {
    this.element.className = obj.className
  }
  return this
}

ElementWrapper.prototype.isEditable = function() {
  this.element.contentEditable = true
  return this
}

ElementWrapper.prototype.html = function() {
  return this.element.innerHTML
}

ElementWrapper.prototype.outerHtml = function() {
  return this.element.outerHtml
}

export { el }
