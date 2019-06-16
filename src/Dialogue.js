import { el } from './DOM'

function showDialog(richtext, options) {
  const border = create()
  const input = border.firstChild().firstChild()
  const saveButton = input.next()
  const cancelButton = saveButton.next()
  let succeededFunc, canceledFunc

  const close = () => richtext.parent().remove(border)
  const open = () => richtext.parent().insertAfter(richtext, border)
  const succeeded = () => {
    close()
    if (succeededFunc) {
      succeededFunc(input.val())
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

  if (options) {
    input.val(options.defaultValue)
  }

  border.element.addEventListener('click', e => {
    if (border.is(e.target)) {
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

function create() {
  const input = el('input')
  input.element.autofocus = true
  input.element.dataset.testid = 'dialogue-input'

  const rect = window
    .getSelection()
    .getRangeAt(0)
    .getBoundingClientRect()

  const border = el('div')
    .style({
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      position: 'absolute',
      top: '0',
      left: '0',
      'z-index': 1000
    })
    .append(
      el('div')
        .className('dialogue')
        .append(input)
        .append(el('button').val('Save'))
        .append(el('button').val('Cancel'))
        .style({
          top: rect.top + rect.height + 3 + 'px',
          left: rect.left + 'px'
        })
    )
  border.element.dataset.testid = 'dialogue'

  return border
}

export { showDialog }
