import { read } from './../../DOM/DomReader'
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
    parent: true,
    tag: 'h1'
  },
  smallHeader: {
    tag: 'h2',
    className: 'header-style'
  }
}

it('read from paragraph editors', () => {
  const editor = el('p')
    .append(el('b').val(el('i').val('hello')))
    .append(' ')
    .append(el('i').val('world'))

  expect(read(effects, editor)).toEqual([
    { text: 'hello', effects: [effects.italic, effects.bold] },
    { text: ' ' },
    { text: 'world', effects: [effects.italic] }
  ])
})

it('read from non paragraph editors', () => {
  const editor = el('h1').val('Title')
  expect(read(effects, editor)).toEqual([
    { text: 'Title', effects: [effects.bigHeader] }
  ])
})

it('take classNames into account for effect detection', () => {
  const editor = el('h2')
    .className('header-style')
    .append(
      el('b')
        .val('Title')
        .className('bold-style')
    )
  expect(read(effects, editor)).toEqual([
    { text: 'Title', effects: [effects.styledBold, effects.smallHeader] }
  ])
})

it('read empty', () => {
  const editor = el('p')
  expect(read(effects, editor)).toEqual([{ text: '' }])
})

it('read paragraph with empty effects', () => {
  expect(
    read(effects, el('p').val(el('h2').className('header-style')))
  ).toEqual([{ text: '', effects: [effects.smallHeader] }])
})

it('read empty parent effect', () => {
  expect(read(effects, el('h1'))).toEqual([
    { text: '', effects: [effects.bigHeader] }
  ])
})
