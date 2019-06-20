import { showDialog } from './Dialog'
import { el } from './DOM'

function mouseHandler(richtext) {
  return function(e) {
    const target = el(e.target)
    if (target.is(richtext)) {
      richtext.lastChild().focus()
      return
    }

    const anchor = el.parentOf(target, 'a')
    if (anchor) {
      showDialog({
        richtext,
        defaultValue: anchor.getAttribute('href'),
        mode: 'edit',
        succeeded: link => anchor.setAttribute('href', link),
        deleted: () => anchor.takeOff()
      })
    }
  }
}

export default mouseHandler
