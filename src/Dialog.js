import { el } from './DOM'

function showDialog(options) {
  const richtext = options.richtext
  options = options || { mode: 'add', defaultValue: '' }
  const { dialog, input, saveButton, deleteButton, cancelButton } = create(
    options
  )

  input.addListener('keyup', e => {
    if (e.key === 'Enter') {
      succeeded()
    } else if (e.key === 'Escape') {
      run(options.canceled)
    }
  })

  let targetOnMouseDown
  dialog.addListener('mousedown', e => (targetOnMouseDown = e.target))
  dialog.addListener('mouseup', e => {
    if (dialog.is(e.target) && dialog.is(targetOnMouseDown)) {
      run(options.canceled)
    }
  })

  saveButton.addListener('click', succeeded)
  cancelButton.addListener('click', () => run(options.canceled))
  if (options.mode === 'edit') {
    deleteButton.addListener('click', () => run(options.deleted))
  }

  richtext.parent().insertAfter(richtext, dialog)
  input.focus()

  function run(func, arg) {
    richtext.parent().remove(dialog)
    if (func) {
      func(arg)
    }
  }

  function succeeded() {
    run(options.succeeded, input.val())
  }
}

function create(options) {
  const input = el('input')
  input.val(options.defaultValue)
  input.element.autofocus = true
  input.element.dataset.testid = 'dialog-input'

  const rect = window
    .getSelection()
    .getRangeAt(0)
    .getBoundingClientRect()

  const saveButton = el('button').val('Save')
  const deleteButton =
    options.mode === 'edit' ? el('button').val('Delete') : null
  const cancelButton = el('button').val('Cancel')

  const dialog = el('div')
    .style({
      width: '100%',
      height: '100%',
      background: 'transparent',
      position: 'absolute',
      top: '0',
      left: '0',
      'z-index': 1000
    })
    .append(
      el('div')
        .style({ position: 'absolute' })
        .className('dialog')
        .append(input)
        .append(saveButton)
        .append(deleteButton)
        .append(cancelButton)
        .style({
          top: rect.top + window.pageYOffset + rect.height + 3 + 'px',
          left: rect.left + 'px'
        })
    )

  dialog.element.dataset.testid = 'dialog'

  return { dialog, input, saveButton, deleteButton, cancelButton }
}

export { showDialog }
