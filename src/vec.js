class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  mult(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }

  div(factor) {
    return new Vec(this.x / factor, this.y / factor);
  }

  tetha() {
    return Math.atan2(this.y, this.x);
  }

  normalize() {
    const m = this.mag();
    if (m != 0 && m != 1) {
      return this.div(m);
    } else {
      return this;
    }
  }

  rotate(tetha) {
    return new Vec(
      this.x * Math.cos(tetha) - this.y * Math.sin(tetha),
      this.x * Math.sin(tetha) + this.y * Math.cos(tetha)
    )
  }
}

module.exports = Vec;
