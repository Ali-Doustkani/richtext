import { el } from './DOM'

function showDialog(richtext) {
  const border = createBorder()
  let succeededFunc, canceledFunc
  // handle save button
  border
    .firstChild()
    .next()
    .addListener('click', () => {
      richtext.remove(border)
      if (succeededFunc) {
        succeededFunc(border.firstChild().element.value)
      }
    })
  // handle cancel button
  border
    .firstChild()
    .next()
    .next()
    .addListener('click', () => {
      richtext.remove(border)
      if (canceledFunc) {
        canceledFunc()
      }
    })
  richtext.shift(border)
  const result = {
    succeeded: callback => {
      succeededFunc = callback
      return result
    },
    canceled: callback => {
      canceledFunc = callback
      return result
    }
  }
  return result
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
