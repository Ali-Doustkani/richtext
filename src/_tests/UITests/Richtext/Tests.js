import { restore, richedit } from '../../../Richtext'
import style from './../../../Stylist/Stylist'
import { render, html } from './utils'

QUnit.moduleStart(() => {
  richedit.init({
    bold: 'b',
    italic: 'i',
    highlight: {
      tag: 'div',
      className: 'text-highlight'
    }
  })
})

QUnit.test('bold a section', assert => {
  richedit(render('hello world')).apply(0, 5, richedit.bold)
  assert.equal(html(), '<b>hello</b> world')
})

QUnit.test('italic a section', assert => {
  richedit(render('hello world')).apply(0, 4, richedit.italic)
  assert.equal(html(), '<i>hell</i>o world')
})

QUnit.test('italic and bold', assert => {
  richedit(render('<i>hello</i> world')).apply(0, 5, richedit.bold)
  assert.equal(html(), '<b><i>hello</i></b> world')
})

QUnit.test('three different styles', assert => {
  richedit(render('<b><i>hello</i></b> world')).apply(0, 5, richedit.highlight)
  assert.equal(
    html(),
    '<div class="text-highlight"><b><i>hello</i></b></div> world'
  )
})

QUnit.test('apply multiple styles', assert => {
  richedit(render('<i>hello</i> world')).apply(6, 11, richedit.bold)
  assert.equal(html(), '<i>hello</i> <b>world</b>')
})

QUnit.test('restore', assert => {
  const model = restore(render('<b><i>hello</i></b> <i>world</i>'))
  assert.deepEqual(model, [
    { text: 'hello', effects: [style.italic, style.bold] },
    { text: ' ' },
    { text: 'world', effects: [style.italic] }
  ])
})
