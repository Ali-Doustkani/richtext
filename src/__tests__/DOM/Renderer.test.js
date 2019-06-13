import { el } from './../../DOM/Query'
import { render as _render } from './../../DOM/Renderer'

let richtext
let editors

beforeEach(() => {
  richtext = el('div')
})

function render(elements) {
  _render({ richtext, editors, elements, listTag: 'ul' })
}

function expectHtml(html) {
  expect(richtext.element.innerHTML).toBe(html)
}

describe('non lists', () => {
  it('render simple elements', () => {
    editors = el('p').appendTo(richtext)
    render([el('p'), el('strong')])
    expectHtml('<p></p><strong></strong>')
  })

  it('throw error on empty list', () => {
    expect(() => render()).toThrow()
    expect(() => render([])).toThrow()
  })

  it('render an array of editors', () => {
    editors = [
      el('p')
        .val('first')
        .appendTo(richtext),
      el('p')
        .val('second')
        .appendTo(richtext)
    ]

    render([el('strong').val('deleted')])

    expectHtml('<strong>deleted</strong>')
  })
})

describe('lists', () => {
  describe('when modifying lists', () => {
    it('modify a list item', () => {
      el('ul')
        .append(el('li').val('Hello'))
        .appendTo(richtext)
      editors = richtext.firstChild().firstChild()

      render([el('li').append(el('b').val('Hello'))])

      expectHtml('<ul><li><b>Hello</b></li></ul>')
    })
  })

  describe('when creating list', () => {
    it('create new list with an item', () => {
      editors = el('p')
        .val('item')
        .appendTo(richtext)

      render([el('li').val('item')])

      expectHtml('<ul><li>item</li></ul>')
    })

    it('create <p><li>', () => {
      editors = el('p')
        .val('HelloWorld')
        .appendTo(richtext)

      render([el('p').val('Hello'), el('li').val('World')])

      expectHtml('<p>Hello</p><ul><li>World</li></ul>')
    })

    it('create <li><p>', () => {
      editors = el('p')
        .val('HelloWorld')
        .appendTo(richtext)

      render([el('li').val('Hello'), el('p').val('World')])

      expectHtml('<ul><li>Hello</li></ul><p>World</p>')
    })

    it('create <p><li><p>', () => {
      editors = el('p')
        .val('123')
        .appendTo(richtext)

      render([el('p').val('1'), el('li').val('2'), el('p').val('3')])

      expectHtml('<p>1</p><ul><li>2</li></ul><p>3</p>')
    })

    it('append <li> to previous sibling list', () => {
      el('ul')
        .append(el('li').val('1'))
        .appendTo(richtext)
      editors = el('p')
        .val('2')
        .appendTo(richtext)

      render([el('li').val('2')])

      expectHtml('<ul><li>1</li><li>2</li></ul>')
    })

    it('append <li><p> to previous sibling list', () => {
      el('ul')
        .append(el('li').val('1'))
        .appendTo(richtext)
      editors = el('p')
        .val('23')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('4'))
        .appendTo(richtext)

      render([el('li').val('2'), el('p').val('3')])

      expectHtml('<ul><li>1</li><li>2</li></ul><p>3</p><ul><li>4</li></ul>')
    })

    it('append <p><li> to previous sibling list', () => {
      el('ul')
        .append(el('li').val('1'))
        .appendTo(richtext)
      editors = el('p')
        .val('23')
        .appendTo(richtext)

      render([el('p').val('2'), el('li').val('3')])

      expectHtml('<ul><li>1</li></ul><p>2</p><ul><li>3</li></ul>')
    })

    it('append <li> to next sibling list', () => {
      editors = el('p')
        .val('1')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('2'))
        .appendTo(richtext)

      render([el('li').val('1')])

      expectHtml('<ul><li>1</li><li>2</li></ul>')
    })

    it('append <p><li> to next sibling list', () => {
      editors = el('p')
        .val('12')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('3'))
        .appendTo(richtext)

      render([el('p').val('1'), el('li').val('2')])

      expectHtml('<p>1</p><ul><li>2</li><li>3</li></ul>')
    })

    it('append <li><p> to next sibling list', () => {
      editors = el('p')
        .val('12')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('3'))
        .appendTo(richtext)

      render([el('li').val('1'), el('p').val('2')])

      expectHtml('<ul><li>1</li></ul><p>2</p><ul><li>3</li></ul>')
    })

    it('merge <li> when between two <ul>', () => {
      el('ul')
        .append(el('li').val('1'))
        .appendTo(richtext)
      editors = el('p')
        .val('2')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('3'))
        .appendTo(richtext)

      render([el('li').val('2')])

      expectHtml('<ul><li>1</li><li>2</li><li>3</li></ul>')
    })
  })

  describe('when appending and deleting list item', () => {
    it('delete an item to another item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('2'))
        .appendTo(richtext)

      editors = [
        richtext.firstChild().firstChild(),
        richtext
          .firstChild()
          .firstChild()
          .next()
      ] // <li>1</li> <li>2</li>

      render([el('li').val('12')])

      expectHtml('<ul><li>12</li></ul>')
    })

    it('append a paragraph to an item', () => {
      el('ul')
        .append(el('li').val('1'))
        .appendTo(richtext)
      el('p')
        .val('2')
        .appendTo(richtext)
      editors = [
        richtext.firstChild().firstChild(),
        richtext.firstChild().next()
      ]

      render([el('li').val('12')])

      expectHtml('<ul><li>12</li></ul>')
    })

    it('delete an item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li'))
        .appendTo(richtext)

      editors = [
        richtext.firstChild().firstChild(),
        richtext
          .firstChild()
          .firstChild()
          .next()
      ]

      render([el('li').val('2')])

      expectHtml('<ul><li>2</li></ul>')
    })
  })

  describe('when changing list item to a single element', () => {
    it('first item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('2'))
        .appendTo(richtext)

      editors = richtext.firstChild().firstChild() // <li>1</li>

      render([el('p').val('1')])

      expectHtml('<p>1</p><ul><li>2</li></ul>')
    })

    it('middle item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('2'))
        .append(el('li').val('3'))
        .appendTo(richtext)
      editors = richtext
        .firstChild()
        .firstChild()
        .next() // <li>2</li>

      render([el('p').val('2')])

      expectHtml('<ul><li>1</li></ul><p>2</p><ul><li>3</li></ul>')
    })

    it('last item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('2'))
        .appendTo(richtext)
      editors = richtext
        .firstChild()
        .firstChild()
        .next() // <li>2</li>

      render([el('p').val('2')])

      expectHtml('<ul><li>1</li></ul><p>2</p>')
    })

    it('change list to element completely', () => {
      el('p')
        .val('1')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('2'))
        .appendTo(richtext)
      editors = [
        richtext.firstChild(),
        richtext
          .firstChild()
          .next()
          .firstChild()
      ]

      render([el('p').val('12')])

      expectHtml('<p>12</p>')
    })
  })

  describe('when changing list item to multiple item', () => {
    it('single item', () => {
      el('ul')
        .append(el('li').val('12'))
        .appendTo(richtext)
      editors = richtext.firstChild().firstChild() // <li>12</li>

      render([el('li').val('1'), el('li').val('2')])

      expectHtml('<ul><li>1</li><li>2</li></ul>')
    })

    it('first item', () => {
      el('ul')
        .append(el('li').val('12'))
        .append(el('li').val('3'))
        .appendTo(richtext)
      editors = richtext.firstChild().firstChild() // <li>12</li>

      render([el('li').val('1'), el('p').val('2')])

      expectHtml('<ul><li>1</li></ul><p>2</p><ul><li>3</li></ul>')
    })

    it('middle item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('23'))
        .append(el('li').val('4'))
        .appendTo(richtext)
      editors = richtext
        .firstChild()
        .firstChild()
        .next()

      render([el('li').val('2'), el('p').val('3')])

      expectHtml('<ul><li>1</li><li>2</li></ul><p>3</p><ul><li>4</li></ul>')
    })

    it('last item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('23'))
        .appendTo(richtext)
      editors = richtext
        .firstChild()
        .firstChild()
        .next()

      render([el('li').val('2'), el('p').val('3')])

      expectHtml('<ul><li>1</li><li>2</li></ul><p>3</p>')
    })
  })
})
