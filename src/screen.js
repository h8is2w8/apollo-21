import { drawCircle } from './helpers.js'

const ORBIT_COLOR = 'black';
const GRID_COLOR  = 'grey';

export default class Screen {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.canvas.width = width * 2;
    this.canvas.height = height * 2;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.style.border = '1px solid black';

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(2,2);

    this.width = width;
    this.height = height;
  }

  // draws world from WorldState
  draw(ws) {
    this.clearWorld();
    this.drawCelestialObject(ws.sun);
    this.drawRocket(ws.rocket);
    if (ws.drawGrid) this.drawGrid(0, this.width, 0, this.height, 3);
  }

  // clears scene
  clearWorld() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  // draws orbits around an obj
  drawOrbits(obj) {
    for (let i = 1; i <= obj.satellites.length; i++) {
      drawCircle(
        this.ctx,
        obj.pos.x, obj.pos.y,
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

    this.ctx.strokeStyle = GRID_COLOR;

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

    this.drawGrid(x1, midX, y1, midY, n - 1); // 1st square
    this.drawGrid(midX, x2, y1, midY, n - 1); // 2nd square
    this.drawGrid(x1, midX, midY, y2, n - 1); // 3rd square
    this.drawGrid(midX, x2, midY, y2, n - 1); // 4rd square
  }

  drawCelestialObject(obj) {
    if (obj.drawOrbits) { this.drawOrbits(obj) };
    drawCircle(this.ctx, obj.pos.x, obj.pos.y, obj.r, obj.color, true);
    obj.satellites.filter(Boolean).forEach(this.drawCelestialObject.bind(this));
  }

  drawRocket(rocket) {
    const{p1, p2, p3} = rocket;

    this.ctx.beginPath();

    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.lineTo(p3.x, p3.y);

    this.ctx.fillStyle = rocket.color;
    this.ctx.fill();
  }
}
