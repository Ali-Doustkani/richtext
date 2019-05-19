const sandbox = document.createElement('div')
document.body.appendChild(sandbox)

function render(editorContent) {
  sandbox.innerHTML = editorContent
  return sandbox
}

function html() {
  return sandbox.innerHTML
}

export { render, html }
