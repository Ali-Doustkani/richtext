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
  addDefaultDecors(options.decors)
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test'
  ) {
    options.decors = checkDecors(options.decors)
  }
  return options
}

function init(options, name, value) {
  if (options[name] === undefined) {
    options[name] = value
  }
}

function addDefaultDecors(decors) {
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
}

export { checkEditor, setOptions, checkOptions }
