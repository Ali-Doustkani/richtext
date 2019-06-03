import createDomReader from './../../DOM/DomReader'
import { el } from './../../DOM/Query'

const effects = {
  bold: { tag: 'b' },
  styledBold: { tag: 'b', className: 'bold-style' },
  italic: { tag: 'i' },
  highlight: {
    tag: 'div',
    className: 'text-highlight'
  },
  bigHeader: {
    tag: 'h1'
  },
  styledHeader: {
    tag: 'h1',
    className: 'header-style'
  }
}

const read = createDomReader(effects)

it('read from paragraph editors', () => {
  const editor = el('p')
    .append(el('b').val(el('i').val('hello')))
    .append(' ')
    .append(el('i').val('world'))
  //editor.innerHTML = '<b><i>hello</i></b> <i>world</i>'
expect(true).toBe(false)
  expect(read(editor)).toEqual([
    { text: 'hello', effects: [effects.italic, effects.bold] },
    { text: ' ' },
    { text: 'world', effects: [effects.italic] }
  ])
})

it('read from non paragraph editors', () => {
  const editor = el('h1').val('Title')
  expect(read(editor)).toEqual([
    { text: 'Title', effects: [effects.bigHeader] }
  ])
})

it('take classNames into account for effect detection', () => {
  const editor = el('h1')
    .className('header-style')
    .append(
      el('b')
        .val('Title')
        .className('bold-style')
    )
  expect(read(editor)).toEqual([
    { text: 'Title', effects: [effects.styledBold, effects.styledHeader] }
  ])
})

it('read empty', () => {
  const editor = el('p')
  expect(read(editor)).toEqual([{ text: '' }])
})

it('read empty with effects', () => {
  expect(read(el('p').val(el('h1').className('header-style')))).toEqual([
    { text: '', effects: [effects.styledHeader] }
  ])
})
