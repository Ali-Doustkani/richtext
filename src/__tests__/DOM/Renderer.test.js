import { el } from './../../DOM/Query'
import { render } from './../../DOM/Renderer'

let richtext
let editor

beforeEach(() => {
  richtext = el('div')
})

describe('non lists', () => {
  it('render simple elements', () => {
    editor = el('p').appendTo(richtext)
    render(richtext, editor, [el('p'), el('strong')])
    expect(richtext.element.innerHTML).toBe('<p></p><strong></strong>')
  })

  it('throw error on empty list', () => {
    expect(() => render(richtext, editor)).toThrow()
    expect(() => render(richtext, editor, [])).toThrow()
  })

  it('render an array of editors', () => {
    editor = [
      el('p')
        .val('first')
        .appendTo(richtext),
      el('p')
        .val('second')
        .appendTo(richtext)
    ]

    render(richtext, editor, [el('strong').val('deleted')])

    expect(richtext.element.innerHTML).toBe('<strong>deleted</strong>')
  })
})

describe('lists', () => {
  describe('when modifying lists', () => {
    it('modify a list item', () => {
      el('ul')
        .append(el('li').val('Hello'))
        .appendTo(richtext)
      editor = richtext.firstChild().firstChild()

      render(richtext, editor, [el('li').append(el('b').val('Hello'))])

      expect(richtext.element.innerHTML).toBe('<ul><li><b>Hello</b></li></ul>')
    })
  })

  describe('when creating list', () => {
    it('create new list with an item', () => {
      editor = el('p')
        .val('item')
        .appendTo(richtext)

      render(richtext, editor, [el('li').val('item')])

      expect(richtext.element.innerHTML).toBe('<ul><li>item</li></ul>')
    })

    it('append item to previous sibling list', () => {
      el('ul')
        .append(el('li').val('1'))
        .appendTo(richtext)
      editor = el('p')
        .val('2')
        .appendTo(richtext)

      render(richtext, editor, [el('li').val('2')])

      expect(richtext.element.innerHTML).toBe('<ul><li>1</li><li>2</li></ul>')
    })

    it('append item to next sibling list', () => {
      editor = el('p')
        .val('1')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('2'))
        .appendTo(richtext)

      render(richtext, editor, [el('li').val('1')])

      expect(richtext.element.innerHTML).toBe('<ul><li>1</li><li>2</li></ul>')
    })

    it('merge lists when appending items in between', () => {
      el('ul')
        .append(el('li').val('1'))
        .appendTo(richtext)
      editor = el('p')
        .val('2')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('3'))
        .appendTo(richtext)

      render(richtext, editor, [el('li').val('2')])

      expect(richtext.element.innerHTML).toBe(
        '<ul><li>1</li><li>2</li><li>3</li></ul>'
      )
    })
  })

  describe('when appending and deleting list item', () => {
    it('delete an item to another item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('2'))
        .appendTo(richtext)

      editor = [
        richtext.firstChild().firstChild(),
        richtext
          .firstChild()
          .firstChild()
          .next()
      ] // <li>1</li> <li>2</li>

      render(richtext, editor, [el('li').val('12')])

      expect(richtext.element.innerHTML).toBe('<ul><li>12</li></ul>')
    })

    it('append a paragraph to an item', () => {
      el('ul')
        .append(el('li').val('1'))
        .appendTo(richtext)
      el('p')
        .val('2')
        .appendTo(richtext)
      editor = [
        richtext.firstChild().firstChild(),
        richtext.firstChild().next()
      ]

      render(richtext, editor, [el('li').val('12')])

      expect(richtext.element.innerHTML).toBe('<ul><li>12</li></ul>')
    })

    it('delete an item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li'))
        .appendTo(richtext)

      editor = [
        richtext.firstChild().firstChild(),
        richtext
          .firstChild()
          .firstChild()
          .next()
      ]

      render(richtext, editor, [el('li').val('2')])

      expect(richtext.element.innerHTML).toBe('<ul><li>2</li></ul>')
    })
  })

  describe('when changing list item to a single element', () => {
    it('first item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('2'))
        .appendTo(richtext)

      editor = richtext.firstChild().firstChild() // <li>1</li>

      render(richtext, editor, [el('p').val('1')])

      expect(richtext.element.innerHTML).toBe('<p>1</p><ul><li>2</li></ul>')
    })

    it('middle item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('2'))
        .append(el('li').val('3'))
        .appendTo(richtext)
      editor = richtext
        .firstChild()
        .firstChild()
        .next() // <li>2</li>

      render(richtext, editor, [el('p').val('2')])

      expect(richtext.element.innerHTML).toBe(
        '<ul><li>1</li></ul><p>2</p><ul><li>3</li></ul>'
      )
    })

    it('last item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('2'))
        .appendTo(richtext)
      editor = richtext
        .firstChild()
        .firstChild()
        .next() // <li>2</li>

      render(richtext, editor, [el('p').val('2')])

      expect(richtext.element.innerHTML).toBe('<ul><li>1</li></ul><p>2</p>')
    })

    it('change list to element completely', () => {
      el('p')
        .val('1')
        .appendTo(richtext)
      el('ul')
        .append(el('li').val('2'))
        .appendTo(richtext)
      editor = [
        richtext.firstChild(),
        richtext
          .firstChild()
          .next()
          .firstChild()
      ]

      render(richtext, editor, [el('p').val('12')])

      expect(richtext.element.innerHTML).toBe('<p>12</p>')
    })
  })

  describe('when changing list item to multiple item', () => {
    it('single item', () => {
      el('ul')
        .append(el('li').val('12'))
        .appendTo(richtext)
      editor = richtext.firstChild().firstChild() // <li>12</li>

      render(richtext, editor, [el('li').val('1'), el('li').val('2')])

      expect(richtext.element.innerHTML).toBe('<ul><li>1</li><li>2</li></ul>')
    })

    it('first item', () => {
      el('ul')
        .append(el('li').val('12'))
        .append(el('li').val('3'))
        .appendTo(richtext)
      editor = richtext.firstChild().firstChild() // <li>12</li>

      render(richtext, editor, [el('li').val('1'), el('p').val('2')])

      expect(richtext.element.innerHTML).toBe(
        '<ul><li>1</li></ul><p>2</p><ul><li>3</li></ul>'
      )
    })

    it('middle item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('23'))
        .append(el('li').val('4'))
        .appendTo(richtext)
      editor = richtext
        .firstChild()
        .firstChild()
        .next()

      render(richtext, editor, [el('li').val('2'), el('p').val('3')])

      expect(richtext.element.innerHTML).toBe(
        '<ul><li>1</li><li>2</li></ul><p>3</p><ul><li>4</li></ul>'
      )
    })

    it('last item', () => {
      el('ul')
        .append(el('li').val('1'))
        .append(el('li').val('23'))
        .appendTo(richtext)
      editor = richtext
        .firstChild()
        .firstChild()
        .next()

      render(richtext, editor, [el('li').val('2'), el('p').val('3')])

      expect(richtext.element.innerHTML).toBe(
        '<ul><li>1</li><li>2</li></ul><p>3</p>'
      )
    })
  })
})
