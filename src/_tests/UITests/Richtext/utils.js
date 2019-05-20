import { fireEvent } from 'dom-testing-library'

let sandbox = null

function initDOM() {
  if (sandbox) {
    document.body.removeChild(sandbox)
  }
  sandbox = document.createElement('div')
  document.body.appendChild(sandbox)
}

function getEditor() {
  return sandbox
}

function render(editorContent) {
  sandbox.innerHTML = '<p>' + editorContent + '</p>'
  sandbox.firstChild.contentEditable = true
  sandbox.firstChild.focus()
  return sandbox
}

function html() {
  return sandbox.innerHTML.replace(/ contentEditable="true"/gi, '')
}

function type(value) {
  if (sandbox.children.length === 1) {
    sandbox.firstChild.focus()
  }
  document.activeElement.innerHTML += value
  setCaret(document.activeElement.textContent.length)
}

function setCaret(pos) {
  const current = document.activeElement.firstChild
  const selection = window.getSelection()
  const range = document.createRange()
  range.setStart(current, pos)
  selection.removeAllRanges()
  selection.addRange(range)
}

function enter() {
  fireEvent.keyDown(sandbox.firstChild, { key: 'Enter', code: 13 })
  fireEvent.keyUp(sandbox.firstChild, { key: 'Enter', code: 13 })
}

export { initDOM, render, html, getEditor, type, enter, setCaret }
