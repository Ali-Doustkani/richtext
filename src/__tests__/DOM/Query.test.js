import { el } from './../../DOM/Query'

let owner = el('div')
beforeEach(() => {
  owner = el('div')
})

describe('manipulations', () => {
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

  it('insert single item after', () => {
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

  it('insert single item before', () => {
    const h3 = el('h3')
    expect(
      owner
        .append(el('h1'))
        .append(h3)
        .insertBefore(h3, el('h2')).element.innerHTML
    ).toBe('<h1></h1><h2></h2><h3></h3>')
  })

  it('insert array before', () => {
    const h3 = el('h3')
    expect(
      owner.append(h3).insertBefore(h3, [el('h1'), el('h2')]).element.innerHTML
    ).toBe('<h1></h1><h2></h2><h3></h3>')
  })

  it('shift single item to the beginning of parent', () => {
    const parent = el('div')
      .append(el('p').val('Original'))
      .shift(el('h1').val('New'))
    expect(parent.element.innerHTML).toBe('<h1>New</h1><p>Original</p>')
  })

  it('remove single item', () => {
    const h2 = el('h2')
    expect(
      owner
        .append(el('h1'))
        .append(h2)
        .append(el('h3'))
        .remove(h2).element.innerHTML
    ).toBe('<h1></h1><h3></h3>')
  })

  it('remove list', () => {
    const a = el('p').val('first')
    const b = el('p').val('second')
    expect(
      owner
        .append(a)
        .append(b)
        .remove([a, b]).element.innerHTML
    ).toBe('')
  })

  it('remove itself', () => {
    const parent = el('div')
    el('p')
      .val('Hey')
      .appendTo(parent)
      .remove()
    expect(parent.element.innerHTML).toBe('')
  })

  it('do nothing with already removed self', () => {
    const parent = el('div')
    el('p')
      .appendTo(parent)
      .remove()
      .remove()
    expect(parent.element.innerHTML).toBe('')
  })

  it('set classs name', () => {
    expect(owner.className('owner-style').element.outerHTML).toBe(
      '<div class="owner-style"></div>'
    )
  })

  it('set class from an object', () => {
    expect(
      owner.append(el('p').setClassFrom(undefined)).element.innerHTML
    ).toBe('<p></p>')
    expect(owner.append(el('p').setClassFrom({})).element.innerHTML).toBe(
      '<p></p><p></p>'
    )
    expect(
      owner.append(el('p').setClassFrom({ className: 'style' })).element
        .innerHTML
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

  it('append text and element', () => {
    expect(
      el('p')
        .append('ab')
        .append(el('b').val('c'))
        .append('d').element.outerHTML
    ).toBe('<p>ab<b>c</b>d</p>')
  })

  it('append array of query objects', () => {
    expect(
      el('ul').append([el('li').val('1'), el('li').val('2')]).element.innerHTML
    ).toBe('<li>1</li><li>2</li>')
  })

  it('convert element type', () => {
    const parent = el('div')
    const li = el('li')
      .val('some text')
      .appendTo(parent)
      .to('p')
    expect(li.element.outerHTML).toBe('<p>some text</p>')
  })

  it('move children to other element', () => {
    const parent = el('div')
    const firstList = el('ul')
      .append(el('li').val('1'))
      .appendTo(parent)
    const secondList = el('ul')
      .append(el('li').val('2'))
      .append(el('li').val('3'))
      .appendTo(parent)
    secondList.moveChildrenTo(firstList)
    expect(parent.element.innerHTML).toBe(
      '<ul><li>1</li><li>2</li><li>3</li></ul><ul></ul>'
    )
  })

  it('split children from parent and return them', () => {
    const parent = el('ul')
      .append(el('li').val('1'))
      .append(el('li').val('2'))
      .append(el('li').val('3'))
      .append(el('li').val('4'))

    const rest = parent.splitFrom(parent.firstChild().next())

    expect(parent.element.childNodes.length).toBe(1)
    expect(rest.length).toBe(3)
    expect(rest[0].val()).toBe('2')
    expect(rest[1].val()).toBe('3')
    expect(rest[2].val()).toBe('4')
  })
})

describe('checkings', () => {
  it('check with tagname', () => {
    expect(el('p').is('p')).toBe(true)
  })

  it('check with element type', () => {
    expect(
      el('p')
        .val('text')
        .firstChild()
        .is(Node.TEXT_NODE)
    ).toBe(true)
  })

  it('check with HTMLElement', () => {
    const p = document.createElement('p')
    expect(el(p).is(p)).toBe(true)
  })

  it('check with QueryElement', () => {
    const p = el('p')
    expect(p.is(p)).toBe(true)
    expect(p.is(el('p'))).toBe(false)
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

  it('check whether there is any children', () => {
    expect(el('p').hasChildren()).toBe(false)
    expect(
      el('p')
        .val('text')
        .hasChildren()
    ).toBe(true)
  })

  it('count number of children', () => {
    expect(el('p').count()).toBe(0)
    expect(
      el('ul')
        .append(el('li'))
        .append(el('li'))
        .count()
    ).toBe(2)
  })
})

describe('navigationals', () => {
  it('get first child', () => {
    expect(
      el('p')
        .val(el('h1'))
        .firstChild()
        .is('h1')
    ).toBe(true)
  })

  it('get last child', () => {
    expect(
      el('p')
        .append(el('b'))
        .append(el('i'))
        .lastChild()
        .is('i')
    ).toBe(true)
  })

  it('get next sibling', () => {
    expect(
      el('p')
        .append(el('h1'))
        .append(el('h2'))
        .firstChild()
        .next()
        .is('h2')
    ).toBe(true)
  })

  it('get previous sibling', () => {
    const p = el('p').appendTo(owner)
    const pre = el('pre').appendTo(owner)
    expect(pre.previousIs(p)).toBe(true)
  })
})
