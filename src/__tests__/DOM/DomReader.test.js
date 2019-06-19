import { read } from './../../DOM/DomReader'
import { el } from './../../DOM/Query'

let richtext
beforeEach(() => (richtext = el('div')))

const D = {
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

  expect(read(D, richtext.firstChild())).toEqual([
    { text: 'hello', decors: [D.italic, D.bold] },
    { text: ' ', decors: [] },
    { text: 'world', decors: [D.italic] }
  ])
})

it('find decors based on classNames', () => {
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
  expect(read(D, richtext.firstChild())).toEqual([
    { text: 'Title', decors: [D.styledBold, D.smallHeader] }
  ])
})

it('read empty editor', () => {
  richtext.append(el('p'))
  expect(read(D, richtext.firstChild())).toEqual([{ text: '', decors: [] }])
})

it('read editor with empty decors', () => {
  richtext.append(el('p').val(el('h2').className('header-style')))
  expect(read(D, richtext.firstChild())).toEqual([
    { text: '', decors: [D.smallHeader] }
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
  expect(read(D, richtext.firstChild())).toEqual([
    { text: 'Hey', decors: [{ tag: 'a', href: 'link' }] }
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
  expect(read(D, richtext.firstChild())).toEqual([
    { text: 'abc', decors: [{ tag: 'a', href: 'link' }, D.bold] },
    { text: 'def', decors: [D.bold] }
  ])
})

it('read editor tag as decor', () => {
  richtext.append(el('i').val('HelloWorld'))
  expect(read(D, richtext.firstChild())).toEqual([
    { text: 'HelloWorld', decors: [D.list] }
  ])
})
