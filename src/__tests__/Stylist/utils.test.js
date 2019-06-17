import { when } from '../../Stylist/utils'

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
