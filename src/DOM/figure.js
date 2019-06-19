import { el } from './Query'

const button = el('button')
  .val('Remove')
  .style({
    position: 'absolute',
    left: '0',
    top: '0'
  })
  .addListener('click', e => {
    el(e.target)
      .parent()
      .remove()
  })

const createFigure = img =>
  el('figure')
    .append(img)
    .append(
      el('figcaption')
        .isEditable()
        .style({ background: '#FAF3F2' })
    )
    .style({
      position: 'relative',
      margin: '5px',
      display: 'inline-block',
      border: '1px dashed gray'
    })
    .addListener('mouseenter', showDelete)
    .addListener('mouseleave', hideDelete)

const showDelete = e => {
  const figure = el(e.target)
  figure.style({ opacity: '0.94' })
  figure.insertBefore(figure.child(0), button)
}

const hideDelete = e =>
  el(e.target)
    .style({ opacity: '1' })
    .remove(button)

export { createFigure }
