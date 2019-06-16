import { traverse } from './../../DOM/PreOrderTravers'
import { el } from './../../DOM/Query'

it('visit the root', () => {
  const p = el('p').val('Hello')
  const result = traverse(p)
  expect(result.length).toBe(1)
  expect(result[0].element.data).toBe('Hello')
})

it('visit empty tree', () => {
  const result = traverse(null)
  expect(result.length).toBe(0)
})

it('visit a one level binary tree', () => {
  const p = el('p')
    .append(el('b').val('Hello'))
    .append(el('i').val('World'))
  const result = traverse(p)

  expect(result.length).toBe(2)
  expect(result[0].element.data).toBe('Hello')
  expect(result[1].element.data).toBe('World')
})

it('visit a complex tree', () => {
  const p = el('p')
    .append(
      el('b')
        .append(el('i').val('Hello'))
        .append('World')
    )
    .append(el('a').val('Again'))

  const result = traverse(p)

  expect(result.length).toBe(3)
  expect(result[0].val()).toBe('Hello')
  expect(result[1].val()).toBe('World')
  expect(result[2].val()).toBe('Again')
})

it('visit empty nodes', () => {
  const p = el('p')
    .append(el('b'))
    .append(el('i').val('Second'))

  const result = traverse(p)

  expect(result.length).toBe(2)
  expect(result[0].is('b')).toBe(true)
  expect(result[1].element.data).toBe('Second')
})
