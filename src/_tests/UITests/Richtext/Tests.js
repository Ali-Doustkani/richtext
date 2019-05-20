import { restore, richtext } from '../../../Richtext'
import style from './../../../Stylist/Stylist'
import { initDOM, render, html, getEditor, type, enter } from './utils'

QUnit.moduleStart(() => {
  richtext.init({
    bold: 'b',
    italic: 'i',
    highlight: {
      tag: 'div',
      className: 'text-highlight'
    }
  })
})

QUnit.testStart(initDOM)

QUnit.test('bold a section', assert => {
  richtext(render('hello world')).apply(0, 5, richtext.bold)
  assert.equal(html(), '<p><b>hello</b> world</p>')
})

QUnit.test('italic a section', assert => {
  richtext(render('hello world')).apply(0, 4, richtext.italic)
  assert.equal(html(), '<p><i>hell</i>o world</p>')
})

QUnit.test('italic and bold', assert => {
  richtext(render('<i>hello</i> world')).apply(0, 5, richtext.bold)
  assert.equal(html(), '<p><b><i>hello</i></b> world</p>')
})

QUnit.test('three different styles', assert => {
  richtext(render('<b><i>hello</i></b> world')).apply(0, 5, richtext.highlight)
  assert.equal(
    html(),
    '<p><div class="text-highlight"><b><i>hello</i></b></div> world</p>'
  )
})

QUnit.test('apply multiple styles', assert => {
  richtext(render('<i>hello</i> world')).apply(6, 11, richtext.bold)
  assert.equal(html(), '<p><i>hello</i> <b>world</b></p>')
})

QUnit.test('restore', assert => {
  const model = restore(render('<b><i>hello</i></b> <i>world</i>').firstChild)
  assert.deepEqual(model, [
    { text: 'hello', effects: [style.italic, style.bold] },
    { text: ' ' },
    { text: 'world', effects: [style.italic] }
  ])
})

QUnit.test('enter multiple paragraphs', assert => {
  richtext(getEditor())
  type('hello')
  enter()
  type('world')
  assert.equal(html(), '<p>hello</p><p>world</p>')
})

QUnit.test('style something from second paragraph', assert => {
  const editor = richtext(getEditor())
  type('1st')
  enter()
  type('second')
  editor.apply(0, 6, richtext.bold)
  assert.equal(html(), '<p>1st</p><p><b>second</b></p>')
})