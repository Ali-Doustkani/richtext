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
}

function enter() {
  fireEvent.keyDown(sandbox.firstChild, { key: 'Enter', code: 13 })
  fireEvent.keyUp(sandbox.firstChild, { key: 'Enter', code: 13 })
}

export { initDOM, render, html, getEditor, type, enter }
