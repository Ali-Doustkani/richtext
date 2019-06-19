import { createFigure } from './../../DOM/figure'
import { el } from './../../DOM/Query'
import 'jest-dom/extend-expect'
import { getByText, queryByText, fireEvent } from '@testing-library/dom'

let figure
beforeEach(() => {
  figure = createFigure(el('img')).element
  document.body.appendChild(figure)
})

it('show remove button on hover', () => {
  fireEvent.mouseEnter(figure)
  expect(getByText(figure, 'Remove')).toBeVisible()
})

it('do not show remove button on leave', () => {
  expect(queryByText(figure, 'Remove')).not.toBeInTheDocument()
  fireEvent.mouseEnter(figure)
  expect(queryByText(figure, 'Remove')).toBeVisible()
  fireEvent.mouseLeave(figure)
  expect(queryByText(figure, 'Remove')).not.toBeInTheDocument()
})

it('remove figure when remove button clicked', () => {
  fireEvent.mouseEnter(figure)
  fireEvent.click(getByText(figure, 'Remove'))
  expect(figure).not.toBeInTheDocument()
})
