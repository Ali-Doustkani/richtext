const rangeBtn = document.createElement('button')
rangeBtn.innerText = 'Range'
rangeBtn.onclick = function() {
  const sel = window.getSelection()
  console.log(sel)
  console.log(sel.getRangeAt(0))
}
document.body.appendChild(rangeBtn)

const output = document.createElement('div')
output.style = 'font-family: sans-serif, font-size: 7px'
const sandbox = document.createElement('div')
document.body.appendChild(sandbox)
document.body.appendChild(output)

export function render(htmlText) {
  window.getSelection().empty()

  sandbox.innerHTML = htmlText.replace(/\s{2,}/g, '')
  const range = document.createRange()

  function node(id) {
    if (typeof id === 'string') {
      return document.getElementById(id).firstChild
    }
    return id
  }
  function selectFrom(id, index) {
    range.setStart(node(id), index)
    return { to }
  }
  function to(id, index) {
    range.setEnd(node(id), index)
    document.getSelection().addRange(range)
  }
  return { selectFrom }
}

export function byId(id) {
  return document.getElementById(id)
}
