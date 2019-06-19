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
    const p = el('p').editable()
    el(richtext).append(p)
    p.focus()
  }
  if (richtext.firstChild.nodeName !== 'P') {
    throw new Error('only <p> element is valid inside richtext')
  }
  const dir = richtext.style.direction
  if (dir !== 'rtl' || dir !== 'ltr') {
    richtext.style.direction = 'ltr'
  }
}

function checkOptions(options) {
  options = options || {}
  init(options, 'staySelected', false)
  init(options, 'defaultLink', '')
  init(options, 'effects', [])
  addDefaultEffects(options.effects)
  if (process.env.NODE_ENV === 'development') {
    options.effects = checkEffects(options.effects)
  }
  return options
}

function init(options, name, value) {
  if (options[name] === undefined) {
    options[name] = value
  }
}

function addDefaultEffects(effects) {
  effects.list = {
    parent: true,
    tag: 'li'
  }
  effects.codebox = {
    parent: true,
    tag: 'pre'
  }
  effects.anchor = {
    tag: 'a',
    href: ''
  }
}

function setOptions(from, to) {
  if (from.staySelected !== undefined) {
    to.staySelected = from.staySelected
  }
  if (from.defaultLink !== undefined) {
    to.defaultLink = from.defaultLink
  }
}

export {
  checkEffects,
  checkEditor,
  addDefaultEffects,
  setOptions,
  checkOptions
}
