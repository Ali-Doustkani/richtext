import { generateSiblings } from './../../DOM/utils'

test('generateSiblings', () => {
  const richtext = document.createElement('article')
  const mainEditor = document.createElement('p')
  richtext.appendChild(mainEditor)
  const prevEditor = document.createElement('h1')
  const nextEditor = document.createElement('h1')

  generateSiblings(richtext, [prevEditor, mainEditor, nextEditor], 1)

  expect(richtext.children.length).toBe(3)
  expect(richtext.children[0]).toBe(prevEditor)
  expect(richtext.children[1]).toBe(mainEditor)
  expect(richtext.children[2]).toBe(nextEditor)
})
