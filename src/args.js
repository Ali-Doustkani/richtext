import { el } from './DOM'

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
  }
}

function checkOptions(options) {
  options = options || {}
  init(options, 'staySelected', false)
  init(options, 'defaultLink', '')
  init(options, 'decors', [])
  addDefaultDecors(options.decors)
  options.decors = checkDecors(options.decors)
  return options
}

function init(options, name, value) {
  if (options[name] === undefined) {
    options[name] = value
  }
}

function addDefaultDecors(decors) {
  decors.orderedList = {
    parent: true,
    tag: 'li',
    parentType: 'ol'
  }
  decors.unorderedList = {
    parent: true,
    tag: 'li',
    parentType: 'ul'
  }
  decors.codebox = {
    parent: true,
    tag: 'pre'
  }
  decors.anchor = {
    tag: 'a',
    href: ''
  }
  decors.caption = {
    parent: true,
    tag: 'figcaption'
  }
}

function checkDecors(decors) {
  decors = standardizeDecors(decors)
  decorsAreOk(decors)
  return decors
}

function decorsAreOk(decors) {
  if (!decors) {
    throw new Error("'rules' cannot be empty")
  }
  Object.entries(decors).forEach(dec => {
    isNotNull(dec)
    tagIsValid(dec)
  })
}

const tagIsValid = decor => {
  if (typeof decor[1].tag !== 'string') {
    throw new Error(`'tag' in ${decor[0]} is not string`)
  }
}

const isNotNull = decor => {
  if (decor[1] === null) {
    throw new Error('a decor cannot be null')
  }
}

function standardizeDecors(decors) {
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

function setOptions(from, to) {
  if (from.staySelected !== undefined) {
    to.staySelected = from.staySelected
  }
  if (from.defaultLink !== undefined) {
    to.defaultLink = from.defaultLink
  }
  if (from.disabled !== undefined) {
    to.disabled = from.disabled
  }
}

export { checkEditor, setOptions, checkOptions }
