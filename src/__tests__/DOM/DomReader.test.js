import { read } from './../../DOM/DomReader'
import { el } from './../../DOM/Query'

let richtext
beforeEach(() => (richtext = el('div')))

const effects = {
  bold: { tag: 'b' },
  styledBold: { tag: 'b', className: 'bold-style' },
  italic: { tag: 'i' },
  smallHeader: {
    tag: 'h2',
    className: 'header-style'
  },
  anchor: {
    tag: 'a',
    href: '' // dynamic attribute
  },
  list: { tag: 'i' }
}

it('read from paragraph editors', () => {
  richtext.append(
    el('p')
      .append(el('b').val(el('i').val('hello')))
      .append(' ')
      .append(el('i').val('world'))
  )

  expect(read(effects, richtext.firstChild())).toEqual([
    { text: 'hello', effects: [effects.italic, effects.bold] },
    { text: ' ', effects: [] },
    { text: 'world', effects: [effects.italic] }
  ])
})

it('find effects based on classNames', () => {
  richtext.append(
    el('p').append(
      el('h2')
        .className('header-style')
        .append(
          el('b')
            .val('Title')
            .className('bold-style')
        )
    )
  )
  expect(read(effects, richtext.firstChild())).toEqual([
    { text: 'Title', effects: [effects.styledBold, effects.smallHeader] }
  ])
})

it('read empty editor', () => {
  richtext.append(el('p'))
  expect(read(effects, richtext.firstChild())).toEqual([
    { text: '', effects: [] }
  ])
})

it('read editor with empty effects', () => {
  richtext.append(el('p').val(el('h2').className('header-style')))
  expect(read(effects, richtext.firstChild())).toEqual([
    { text: '', effects: [effects.smallHeader] }
  ])
})

it('read anchor href', () => {
  richtext.append(
    el('p').append(
      el('a')
        .setAttribute('href', 'link')
        .val('Hey')
    )
  )
  expect(read(effects, richtext.firstChild())).toEqual([
    { text: 'Hey', effects: [{ tag: 'a', href: 'link' }] }
  ])
})

it('read bolded anchor', () => {
  richtext.append(
    el('p').append(
      el('b')
        .append(
          el('a')
            .setAttribute('href', 'link')
            .val('abc')
        )
        .append('def')
    )
  )
  expect(read(effects, richtext.firstChild())).toEqual([
    { text: 'abc', effects: [{ tag: 'a', href: 'link' }, effects.bold] },
    { text: 'def', effects: [effects.bold] }
  ])
})

it('read editor tag as effect', () => {
  richtext.append(el('i').val('HelloWorld'))
  expect(read(effects, richtext.firstChild())).toEqual([
    { text: 'HelloWorld', effects: [effects.list] }
  ])
})
