function preEditor(richeditor) {
  return {
    break: () => {
      const { startOffset, endOffset } = window.getSelection().getRangeAt(0)
      const content = richeditor.element().firstChild.data
      if (startOffset === endOffset) {
        const first = content.slice(0, startOffset)
        const second = content.slice(startOffset)
        const newLine = startOffset === content.length ? '\n\n' : '\n'
        richeditor.element().firstChild.data = first + newLine + second
        richeditor.setPosition(startOffset + 1)
      }
    }
  }
}

export default preEditor
