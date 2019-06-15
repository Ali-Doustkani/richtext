import { el } from './DOM'

function showDialog(richtext) {
  const border = createBorder()
  const input = border.firstChild()
  const saveButton = input.next()
  const cancelButton = saveButton.next()
  let succeededFunc, canceledFunc

  const close = () => richtext.parent().remove(border)
  const open = () => richtext.parent().insertAfter(richtext, border)
  const succeeded = () => {
    close()
    if (succeededFunc) {
      succeededFunc(border.firstChild().element.value)
    }
  }
  const canceled = () => {
    close()
    if (canceledFunc) {
      canceledFunc()
    }
  }

  input.addListener('keyup', e => {
    if (e.key === 'Enter') {
      succeeded()
    } else if (e.key === 'Escape') {
      canceled()
    }
  })
  saveButton.addListener('click', succeeded)
  cancelButton.addListener('click', canceled)

  open()
  input.element.focus()

  return {
    succeeded: function(callback) {
      succeededFunc = callback
      return this
    },
    canceled: function(callback) {
      canceledFunc = callback
      return this
    }
  }
}

function createBorder() {
  const input = el('input')
  input.element.autofocus = true
  input.element.dataset.testid = 'dialogue-input'

  const rect = window
    .getSelection()
    .getRangeAt(0)
    .getBoundingClientRect()

  const border = el('div')
    .className('dialogue')
    .append(input)
    .append(el('button').val('Save'))
    .append(el('button').val('Cancel'))
    .style({
      top: rect.top + rect.height + 3,
      left: rect.left
    })
  border.element.dataset.testid = 'dialogue'

  return border
}

export { showDialog }
