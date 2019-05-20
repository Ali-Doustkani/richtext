import { decide, remove, merge } from '../../Stylist/utils'

test.each`
  decideVal | whenVal  | doCalledVal | undoCalledVal
  ${true}   | ${false} | ${false}    | ${false}
  ${false}  | ${false} | ${false}    | ${false}
  ${true}   | ${true}  | ${true}     | ${false}
  ${false}  | ${true}  | ${false}    | ${true}
`(
  '$takeVal, $whenVal',
  ({ decideVal, whenVal, doCalledVal, undoCalledVal }) => {
    let doCalled = false
    let undoCalled = false
    decide(() => decideVal)
      .withArgument()
      .when(() => whenVal)
      .doWith(() => (doCalled = true))
      .orUndoWith(() => (undoCalled = true))
    expect(doCalled).toBe(doCalledVal)
    expect(undoCalled).toBe(undoCalledVal)
  }
)

test("when act is done don't run anymore", () => {
  let count = 0
  decide(() => true)
    .withArgument()
    .when(() => true)
    .doWith(() => count++)
    .orUndoWith(() => count++)
    .when(() => false)
    .doWith(() => count++)
    .orUndoWith(() => count++)
  expect(count).toBe(1)
})

test('remove item from array', () => {
  const array = [1, 2, 3]
  const result = remove(array, 2)
  expect(result).not.toBe(array)
  expect(result).toEqual([1, 3])
})

test('merge an element to an array, with no duplicate', () => {
  // const array = [1, 2, 3]
  const bold = { tag: 'strong' }
  const italic = { tag: 'i' }
  const highlight = { tag: 'div' }
  const array = [bold, italic]
  const result = merge(array, highlight)
  expect(result).not.toBe(array)
  expect(result).toEqual([bold, italic, highlight])
})

test('merge element with no array', () => {
  const result = merge(undefined, 3)
  expect(result).toEqual([3])
})
