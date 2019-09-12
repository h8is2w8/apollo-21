import { drawCircle } from './helpers.js'

const ORBIT_COLOR = 'black';

export default class Screen {
  constructor(ctx, sun, sun_pos) {
    this.ctx = ctx;
    this.sun = sun;
    this.sun_pos = sun_pos;
  }

  // draws world from WorldState
  draw(ws) {
    this.clearWorld();
    this.drawCelestialBody(ws.sun, ws.sun.pos, ws.time);
    this.drawRocket(ws.player);
    // this.drawGrid(0, WORLD_WIDTH, 0, WORLD_HEIGHT, 3);
  }

  // clears scene
  clearWorld() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  // draws orbits around an obj
  drawOrbits(obj, pos) {
    for (let i = 1; i <= obj.satellites.length; i++) {
      drawCircle(
        this.ctx,
        pos.x, pos.y,
        obj.r + obj.orbitR * i,
        ORBIT_COLOR,
        false
      );
    }
  }

  // draws game grid with granularity n
  drawGrid(x1, x2, y1, y2, n) {
    if (n <= 0) { return; }

    let midX = x1 + (x2 - x1) / 2;
    let midY = y1 + (y2 - y1) / 2;

    this.ctx.strokeStyle = 'grey';

    // draw horizontal line
    this.ctx.beginPath();
    this.ctx.moveTo(x1, midY);
    this.ctx.lineTo(x2, midY);
    this.ctx.stroke();

    // draw vertical line
    this.ctx.beginPath();
    this.ctx.moveTo(midX, y1);
    this.ctx.lineTo(midX, y2);
    this.ctx.stroke();

    drawGrid(x1, midX, y1, midY, n - 1); // 1st square
    drawGrid(midX, x2, y1, midY, n - 1); // 2nd square
    drawGrid(x1, midX, midY, y2, n - 1); // 3rd square
    drawGrid(midX, x2, midY, y2, n - 1); // 4rd square
  }

  drawCelestialBody(obj, pos, time) {
    if (obj.drawOrbits) { this.drawOrbits(obj, pos) };
    drawCircle(this.ctx, pos.x, pos.y, obj.r, obj.c, true);

    obj.satellites.forEach((sat, i) => {
      if (sat) {
        this.drawCelestialBody(sat, sat.pos, time * 5);
      }
    });
  }

  // draws rocket
  drawRocket(rocket) {
    this.ctx.beginPath();
    // CTX.lineWidth = "6";
    this.ctx.strokeStyle = "red";
    this.ctx.rect(rocket.pos.x, rocket.pos.y, 20, 20);
    this.ctx.stroke();
  }
}
