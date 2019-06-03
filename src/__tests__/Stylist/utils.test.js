import { remove, merge, when } from '../../Stylist/utils'

test('when', () => {
  const cond1 = () => true
  const cond2 = () => true
  const cond3 = () => false
  let output

  when(cond1)
    .then(() => (output = 1))
    .otherwise(cond2)
    .then(() => (output = 2))
    .otherwise(cond3)
    .then(() => (output = 3))
    .run()

  expect(output).toBe(1)
})

test('remove item from array', () => {
  const array = [1, 2, 3]
  const result = remove(array, 2)
  expect(result).not.toBe(array)
  expect(result).toEqual([1, 3])
})

test('merge an element to an array', () => {
  const array = [1, 2]
  let result = merge(array, 3)
  expect(result).not.toBe(array)
  expect(result).toEqual([1, 2, 3])

  result = merge(result, 3)
  expect(result).toEqual([1, 2, 3])
})

test('merge element with no array', () => {
  const result = merge(undefined, 3)
  expect(result).toEqual([3])
})
