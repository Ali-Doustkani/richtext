import { el } from './../../DOM/Query'

let owner = el('div')
beforeEach(() => {
  owner = el('div')
})

describe('adding children', () => {
  it('create new el with value', () => {
    el('p')
      .val(el('b').val('HelloWorld'))
      .appendTo(owner)
    expect(owner.element.innerHTML).toBe('<p><b>HelloWorld</b></p>')
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
})

describe('removing children', () => {
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

  it('remove range of items', () => {
    const parent = el('ul')
      .append(el('li').val('1'))
      .append(el('li').val('2'))
      .append(el('li').val('3'))
      .append(el('li').val('4'))

    const rest = parent.removeFrom(parent.firstChild().next())

    expect(parent.element.childNodes.length).toBe(1)
    expect(rest.length).toBe(3)
    expect(rest[0].val()).toBe('2')
    expect(rest[1].val()).toBe('3')
    expect(rest[2].val()).toBe('4')
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
})

describe('static content', () => {
  it('null val empties the content', () => {
    expect(
      el('p')
        .val('HelloWorld')
        .val(null).element.innerHTML
    ).toBe('')
  })

  it('return textContent when val hos no argument', () => {
    expect(
      el('p')
        .val('Hey')
        .val()
    ).toBe('Hey')
  })

  it('convert element type', () => {
    const parent = el('div')
    const li = el('li')
      .val('some text')
      .appendTo(parent)
      .to('p')
    expect(li.element.outerHTML).toBe('<p>some text</p>')
  })
})

describe('attributes', () => {
  it('set classs name', () => {
    expect(owner.className('owner-style').element.outerHTML).toBe(
      '<div class="owner-style"></div>'
    )
  })

  it('set attributes from an object', () => {
    expect(
      owner.append(el('p').setAttributeFrom(undefined)).element.innerHTML
    ).toBe('<p></p>')
    expect(owner.append(el('p').setAttributeFrom({})).element.innerHTML).toBe(
      '<p></p><p></p>'
    )
    expect(
      owner.append(el('p').setAttributeFrom({ className: 'style' })).element
        .innerHTML
    ).toBe('<p></p><p></p><p class="style"></p>')
  })

  it('set contentEditable', () => {
    expect(el('p').element.contentEditable).toBe(undefined)
    expect(el('p').isEditable().element.contentEditable).toBe(true)
  })

  it('set attributes value', () => {
    expect(
      el('p')
        .setAttribute('data-id', '123')
        .val('Hey').element.outerHTML
    ).toBe('<p data-id="123">Hey</p>')
  })

  it('get attributes value', () => {
    expect(
      el('p')
        .setAttribute('data-id', '123')
        .getAttribute('data-id')
    ).toBe('123')
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

  it('loops through children', () => {
    const hello = el('b').val('Hello')
    const world = el('i').val('World')
    const p = el('p')
      .append(hello)
      .append(world)
    const result = []
    p.forChildren(child => result.push(child))
    expect(result.length).toBe(2)
    expect(result[0].element).toBe(hello.element)
    expect(result[1].element).toBe(world.element)
  })
})

describe('eventing', () => {
  it('add event listener', () => {
    const clickEvent = new Event('click')
    const fn = jest.fn()
    const btn = el('button').addListener('click', fn)

    btn.element.dispatchEvent(clickEvent)

    expect(fn).toHaveBeenCalled()
  })

  it('remove event listener', () => {
    const clickEvent = new Event('click')
    const fn = jest.fn()
    const btn = el('button')
      .addListener('click', fn)
      .removeListener('click', fn)

    btn.element.dispatchEvent(clickEvent)

    expect(fn).not.toHaveBeenCalled()
  })
})

describe('styling', () => {
  it('set top', () => {
    const div = el('div').style({ top: 12, left: 13 }).element
    expect(div.style.top).toBe('12px')
    expect(div.style.left).toBe('13px')
  })
})
