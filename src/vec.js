export default class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get tetha() {
    return Math.atan2(this.y, this.x);
  }

  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  minus(other) {
    return new Vec(this.x - other.x, this.y - other.y);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y;
  }

  mult(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }

  div(factor) {
    return new Vec(this.x / factor, this.y / factor);
  }

  normalize() {
    const m = this.mag;
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
