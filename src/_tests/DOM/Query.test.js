import { el } from './../../DOM/Query'

let owner = el('div')
beforeEach(() => {
  owner = el('div')
})

it('null val empties the content', () => {
  expect(
    el('p')
      .val('HelloWorld')
      .val(null).element.innerHTML
  ).toBe('')
})

it('create new el with value', () => {
  el('p')
    .val(el('b').val('HelloWorld'))
    .appendTo(owner)
  expect(owner.element.innerHTML).toBe('<p><b>HelloWorld</b></p>')
})

it('return textContent when val hos no argument', () => {
  expect(
    el('p')
      .val('Hey')
      .val()
  ).toBe('Hey')
})

it('replace children', () => {
  const p = el('p').val('Hey')
  expect(
    owner.append(p).replace(el('h1').val('You'), p).element.innerHTML
  ).toBe('<h1>You</h1>')
})

it('insert after', () => {
  const h1 = el('h1')
  expect(
    owner
      .append(h1)
      .append(el('h3'))
      .insertAfter(h1, el('h2')).element.innerHTML
  ).toBe('<h1></h1><h2></h2><h3></h3>')
})

it('insert array after', () => {
  const h1 = el('h1')
  const arr = [el('h2'), el('h3')]
  expect(owner.append(h1).insertAfter(h1, arr).element.innerHTML).toBe(
    '<h1></h1><h2></h2><h3></h3>'
  )
})

it('remove', () => {
  const h2 = el('h2')
  expect(
    owner
      .append(el('h1'))
      .append(h2)
      .append(el('h3'))
      .remove(h2).element.innerHTML
  ).toBe('<h1></h1><h3></h3>')
})

it('set classs name', () => {
  expect(owner.className('owner-style').element.outerHTML).toBe(
    '<div class="owner-style"></div>'
  )
})

it('set class from an object', () => {
  expect(owner.append(el('p').setClassFrom(undefined)).element.innerHTML).toBe(
    '<p></p>'
  )
  expect(owner.append(el('p').setClassFrom({})).element.innerHTML).toBe(
    '<p></p><p></p>'
  )
  expect(
    owner.append(el('p').setClassFrom({ className: 'style' })).element.innerHTML
  ).toBe('<p></p><p></p><p class="style"></p>')
})

it('set contentEditable', () => {
  expect(el('p').element.contentEditable).toBe(undefined)
  expect(el('p').isEditable().element.contentEditable).toBe(true)
})

it('append text', () => {
  const wrapper = el('p')
    .append('Hello')
    .append('World')
    .append()
  expect(wrapper.element.innerHTML).toBe('HelloWorld')
})

it('check tagname', () => {
  expect(el('p').is('p')).toBe(true)
})

it('check element type', () => {
  expect(
    el('p')
      .val('text')
      .firstChild()
      .is(Node.TEXT_NODE)
  ).toBe(true)
})

it('get first child', () => {
  expect(
    el('p')
      .val(el('h1'))
      .firstChild()
      .is('h1')
  ).toBe(true)
})

it('get next sibling', () => {
  expect(
    el('p')
      .append(el('h1'))
      .append(el('h2'))
      .firstChild()
      .nextSibling()
      .is('h2')
  ).toBe(true)
})

it('check className from an object', () => {
  expect(el('p').hasClassFrom({})).toBe(true)
  expect(
    el('p')
      .className('style')
      .hasClassFrom({})
  ).toBe(false)
  expect(el('p').hasClassFrom({ className: 'sth' })).toBe(false)
  expect(
    el('p')
      .className('s')
      .hasClassFrom({ className: 's' })
  ).toBe(true)
})
