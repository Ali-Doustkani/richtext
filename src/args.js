import { el } from './DOM'

function effectsAreOk(effects) {
  if (!effects) {
    throw new Error("'rules' cannot be empty")
  }
  for (let prop in effects) {
    if (typeof effects[prop] !== 'object') {
      throw new Error(
        `${prop} must be an object containing 'tag' but it's a ${typeof effects[
          prop
        ]}`
      )
    }
    if (typeof effects[prop].tag !== 'string') {
      throw new Error(`'tag' in ${effects[prop]} is not string`)
    }
    if (!effects[prop]) {
      throw new Error(
        `'tag' in ${effects[prop]} does not have a not empty string value`
      )
    }
  }
}

function standardizeEffects(effects) {
  const initObj = {}
  for (let prop in effects) {
    if (typeof effects[prop] === 'string') {
      initObj[prop] = { tag: effects[prop] }
    } else {
      initObj[prop] = effects[prop]
    }
  }
  return initObj
}

function checkEffects(effects) {
  effects = standardizeEffects(effects)
  effectsAreOk(effects)
  return effects
}

function checkEditor(richtext) {
  if (richtext.tagName !== 'DIV' && richtext.tagName !== 'ARTICLE') {
    throw new Error('the richtext can only be a <div> or <article> element')
  }
  if (richtext.contentEditable === true) {
    throw new Error(
      `the contentEditable of <${richtext.tagName}> richtext must be false`
    )
  }
  if (!richtext.children.length) {
    el(richtext).append(el('p').isEditable())
  }
  if (richtext.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside richtext')
  }
}

export { checkEffects, checkEditor }