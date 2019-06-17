import { el } from './DOM'

function importImage(richtext) {
  const currentEdit = el.active()
  const input = el('input')
    .setAttribute('type', 'file')
    .addListener('change', loadImage)
  input.element.click()

  function loadImage() {
    const reader = new FileReader()
    const file = input.element.files[0]
    reader.addEventListener(
      'load',
      () => {
        const img = createImage(reader.result)
        if (currentEdit) {
          richtext.insertAfter(currentEdit, img)
        } else {
          richtext.append(img)
        }
      },
      false
    )
    if (file) {
      reader.readAsDataURL(file)
    }
  }
}

function createImage(source) {
  return el('img')
    .setAttribute('src', source)
    .style({
      'max-width': '100%'
    })
}

export { importImage }
