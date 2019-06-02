function preEditor(controller) {
  return {
    break: () => {
      const { startOffset, endOffset } = window.getSelection().getRangeAt(0)
      const content = controller
        .editor()
        .firstChild()
        .val()
      if (startOffset === endOffset) {
        const first = content.slice(0, startOffset)
        const second = content.slice(startOffset)
        const newLine = startOffset === content.length ? '\n\n' : '\n'
        controller.editor().element.firstChild.data = first + newLine + second

        // controller
        //   .editor()
        //   .val(first + newLine + second)
        controller.setPosition(startOffset + 1)
      }
    }
  }
}

export default preEditor
