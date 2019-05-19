import { selectionPoints } from '../../../Selection'
import { render, byId } from './utils'

QUnit.test('simple selection', assert => {
  render('<p id="root">simple text</p>')
    .selectFrom('root', 1)
    .to('root', 3)
  const result = selectionPoints(byId('root'))
  assert.deepEqual(result, { start: 1, end: 3 })
})

QUnit.test('two elements in a paragraph', assert => {
  render('<p id="start">abc<b>defg</b>hi<b id="end">jklmn</b></p>')
    .selectFrom('start', 2)
    .to('end', 5)
  const result = selectionPoints(byId('start'))
  assert.deepEqual(result, { start: 2, end: 14 })
})

QUnit.test('find common ancestor', assert => {
  render(
    `<p id="first">
      ab<b><i>c</i></b>d
    </p>
    <div>
      <p id="second">
        e<strong>f</strong>ghij
      </p>
    </div>`
  )
    .selectFrom('first', 1)
    .to(byId('second').childNodes[2], 1)
  const result = selectionPoints()
  assert.deepEqual(result, { start: 1, end: 7 })
})

QUnit.test('one root with different children', assert => {
  render(
    `<p id="root">
      hello <strong id="start">world</strong>
    </p>`
  )
    .selectFrom('start', 0)
    .to('start', 5)
  const result = selectionPoints(byId('root'))
  assert.deepEqual(result, { start: 6, end: 11 })
})
