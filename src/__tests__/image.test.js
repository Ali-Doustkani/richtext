import { importImage } from './../image'
import * as Query from './../DOM/Query'

function mockEl(options) {
  options = options || {}
  options.activeEditor = options.activeEditor || null
  options.files = options.files || ['FILE']
  const originalEl = Query.el
  Query.el = jest.fn(() => ({
    setAttribute: jest.fn(() => ({
      addListener: jest.fn((name, func) => {
        return {
          element: {
            files: options.files,
            click: () => func()
          }
        }
      })
    }))
  }))
  Query.el.active = jest.fn(() => options.activeEditor)

  global.FileReader = jest.fn(() => {
    let loadFunc
    return {
      addEventListener: (name, func) => {
        loadFunc = func
      },
      readAsDataURL: () => {
        Query.el = originalEl
        loadFunc()
      },
      result: 'IMG'
    }
  })
}

it('append <img> to the end if no active editor', () => {
  const richtext = Query.el('div').append(Query.el('p'))
  mockEl({ activeEditor: null })

  importImage(richtext)

  expect(richtext.element.innerHTML).toBe(
    '<p></p><img src="IMG" style="max-width: 100%;">'
  )
})

it('put <img> after the current editor', () => {
  const active = Query.el('p').val('Active')
  const richtext = Query.el('div')
    .append(Query.el('p').val('First'))
    .append(active)
    .append(Query.el('p').val('Last'))
  mockEl({ activeEditor: active })

  importImage(richtext)

  expect(richtext.element.innerHTML).toBe(
    '<p>First</p><p>Active</p><img src="IMG" style="max-width: 100%;"><p>Last</p>'
  )
})

it('do not put <img> if no files loaded', () => {
  const richtext = Query.el('div')
  mockEl({ files: [] })

  importImage(richtext)

  expect(richtext.element.innerHTML).toBe('')
})
