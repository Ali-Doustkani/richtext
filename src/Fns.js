const cond = list => params => {
  while (list.length) {
    const c = list.shift()
    if (c[0](params)) {
      c[1](params)
      return true
    }
  }
  return false
}

const unless = (pred, whenFalseFn) => params => {
  if (!pred(params)) {
    whenFalseFn(params)
  }
}

const toArray = p => (Array.isArray(p) ? p : [p])

export { cond, unless, toArray }
