import { el } from './Query'
import { focusPrev } from './../editor'

const remove = e => {
  const btn = el(e.target)
  focusPrev(btn.parent())
  btn
    .removeListener('click', remove)
    .parent()
    .remove()
}

const createFigure = img =>
  el('figure')
    .append(img)
    .append(
      el('button')
        .val('Remove')
        .style({
          display: 'none',
          position: 'absolute',
          left: '0',
          top: '0'
        })
        .addListener('click', remove)
    )
    .append(el('figcaption').editable())
    .style({
      position: 'relative',
      margin: '5px',
      display: 'inline-block',
      border: '1px dashed gray'
    })
    .addListener('mouseenter', showDelete)
    .addListener('mouseleave', hideDelete)

const showDelete = e =>
  el(e.target)
    .style({ opacity: '0.94' })
    .child(1)
    .style({ display: 'inline-block' })

const hideDelete = e =>
  el(e.target)
    .style({ opacity: '1' })
    .child(1)
    .style({ display: 'none' })

const setEventHandlers = figure =>
  figure
    .addListener('mouseenter', showDelete)
    .addListener('mouseleave', hideDelete)
    .child(1)
    .addListener('click', remove)

export { createFigure, setEventHandlers }
