function renderTo(paragraph, model) {
  paragraph.innerHTML = ''
  model.forEach(item => {
    let element
    if (item.effects) {
      element = item.text
      item.effects.forEach(effect => (element = el(effect).value(element)))
    } else {
      element = el(item.text)
    }
    paragraph.appendChild(element)
  })
}

function el(option) {
  if (typeof option === 'string') {
    return document.createTextNode(option)
  }
  const element = document.createElement(option.tag)
  if (option.className) {
    element.setAttribute('class', option.className)
  }
  return {
    value: value => {
      value = typeof value === 'string' ? document.createTextNode(value) : value
      element.appendChild(value)
      return element
    }
  }
}

function createParagraph(model) {
  const paragraph = document.createElement('p')
  paragraph.contentEditable = true
  if (model) {
    renderTo(paragraph, model)
  }
  const editor = document.activeElement.parentNode
  return {
    replaceWith: (p1, p2) => {
      editor.removeChild(p1)
      editor.insertBefore(paragraph, p2)
      editor.removeChild(p2)
      paragraph.focus()
    },
    addAfter: p => {
      p.insertAdjacentElement('afterend', paragraph)
      paragraph.focus()
    },
    append: editor => {
      editor.appendChild(paragraph)
    }
  }
}

export { renderTo, createParagraph }
