import { el } from './DOM'

function showDialog(richtext, options) {
  options = options || { mode: 'add', defaultValue: '' }
  let succeedCallback, cancelCallback, deletCallback
  const { dialogue, input, saveButton, deleteButton, cancelButton } = create(
    options
  )

  input.addListener('keyup', e => {
    if (e.key === 'Enter') {
      succeeded()
    } else if (e.key === 'Escape') {
      run(cancelCallback)
    }
  })

  let targetOnMouseDown
  dialogue.addListener('mousedown', e => (targetOnMouseDown = e.target))
  dialogue.addListener('mouseup', e => {
    if (dialogue.is(e.target) && dialogue.is(targetOnMouseDown)) {
      run(cancelCallback)
    }
  })

  saveButton.addListener('click', succeeded)
  cancelButton.addListener('click', () => run(cancelCallback))
  if (options.mode === 'edit') {
    deleteButton.addListener('click', () => run(deletCallback))
  }

  richtext.parent().insertAfter(richtext, dialogue)
  input.element.focus()

  function run(func, arg) {
    richtext.parent().remove(dialogue)
    if (func) {
      func(arg)
    }
  }

  function succeeded() {
    run(succeedCallback, input.val())
  }

  return {
    succeeded: function(callback) {
      succeedCallback = callback
      return this
    },
    canceled: function(callback) {
      cancelCallback = callback
      return this
    },
    deleted: function(callback) {
      deletCallback = callback
      return this
    }
  }
}

function create(options) {
  const input = el('input')
  input.val(options.defaultValue)
  input.element.autofocus = true
  input.element.dataset.testid = 'dialogue-input'

  const rect = window
    .getSelection()
    .getRangeAt(0)
    .getBoundingClientRect()

  const saveButton = el('button').val('Save')
  const deleteButton =
    options.mode === 'edit' ? el('button').val('Delete') : null
  const cancelButton = el('button').val('Cancel')

  const dialogue = el('div')
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
        .append(saveButton)
        .append(deleteButton)
        .append(cancelButton)
        .style({
          top: rect.top + rect.height + 3 + 'px',
          left: rect.left + 'px'
        })
    )

  dialogue.element.dataset.testid = 'dialogue'

  return { dialogue, input, saveButton, deleteButton, cancelButton }
}

export { showDialog }
