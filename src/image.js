import { el, renderImage, createNewImage } from './DOM'
import { breakAt } from './Stylist'

function importImage(richtext, effects) {
  const currentEdit = el.active()
  const input = el('input')
    .setAttribute('type', 'file')
    .setAttribute('accept', 'image/*')
    .addListener('change', loadImage)
  input.element.click()

  function loadImage() {
    const reader = new FileReader()
    const file = input.element.files[0]
    reader.addEventListener(
      'load',
      () => {
        const img = createNewImage(reader.result)
        if (richtext.isParentOf(currentEdit)) {
          const renderModel = breakAt(effects, currentEdit)
          renderModel.list.splice(1, 0, img)
          renderImage({
            richtext,
            editor: currentEdit,
            elements: renderModel.list
          })
          renderModel.active.element.focus()
        } else {
          renderImage({ richtext, elements: [img, el('p').isEditable()] })
        }
      },
      false
    )
    if (file) {
      reader.readAsDataURL(file)
    }
  }
}

export { importImage }
