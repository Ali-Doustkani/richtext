import { showDialog } from './Dialog'
import { el } from './DOM'

function mouseHandler(richtext) {
  return function(e) {
    const anchor = el.parentOf(el(e.target), 'a')
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
