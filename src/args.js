import { el } from './DOM'

function effectsAreOk(decors) {
  if (!decors) {
    throw new Error("'rules' cannot be empty")
  }
  for (let prop in decors) {
    if (typeof decors[prop] !== 'object') {
      throw new Error(
        `${prop} must be an object containing 'tag' but it's a ${typeof decors[
          prop
        ]}`
      )
    }
    if (typeof decors[prop].tag !== 'string') {
      throw new Error(`'tag' in ${decors[prop]} is not string`)
    }
    if (!decors[prop]) {
      throw new Error(
        `'tag' in ${decors[prop]} does not have a not empty string value`
      )
    }
  }
}

function standardizeEffects(decors) {
  const initObj = {}
  for (let prop in decors) {
    if (typeof decors[prop] === 'string') {
      initObj[prop] = { tag: decors[prop] }
    } else {
      initObj[prop] = decors[prop]
    }
  }
  return initObj
}

function checkEffects(decors) {
  decors = standardizeEffects(decors)
  effectsAreOk(decors)
  return decors
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
  init(options, 'decors', [])
  addDefaultEffects(options.decors)
  if (process.env.NODE_ENV === 'development') {
    options.decors = checkEffects(options.decors)
  }
  return options
}

function init(options, name, value) {
  if (options[name] === undefined) {
    options[name] = value
  }
}

function addDefaultEffects(decors) {
  decors.list = {
    parent: true,
    tag: 'li'
  }
  decors.codebox = {
    parent: true,
    tag: 'pre'
  }
  decors.anchor = {
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
