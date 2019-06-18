class CursorRange {
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
      return new CursorRange(0, end)
    }
    return this
  }

  shiftToStart() {
    return new CursorRange(0, this.end - this.start)
  }

  toEnd() {
    return new CursorRange(this.end, this.end)
  }
}

CursorRange.empty = function() {
  return new CursorRange(0, 0)
}

CursorRange.fromPosition = function(position) {
  return new CursorRange(position, position)
}

export { CursorRange }
