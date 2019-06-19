class Range {
  constructor(start, end) {
    this.start = start
    this.end = end
    Object.freeze(this)
  }

  standing() {
    return this.start === this.end
  }

  selectedForSure(end) {
    if (this.standing()) {
      return new Range(0, end)
    }
    return this
  }

  shiftToStart() {
    return new Range(0, this.end - this.start)
  }

  toEnd() {
    return new Range(this.end, this.end)
  }
}

Range.empty = function() {
  return new Range(0, 0)
}

Range.fromPosition = function(position) {
  return new Range(position, position)
}

export { Range }
