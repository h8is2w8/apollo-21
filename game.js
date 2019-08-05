// Structs

class Vec {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
}

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const WORLD_WIDTH = CANVAS_WIDTH / 2;
const WORLD_HEIGHT = CANVAS_HEIGHT / 2;

const SUN   = { radius: 25, color: 'orange' }
const EARTH = { radius: 8,  color: 'blue' }
const MARS  = { radius: 12, color: 'brown' }
const VENUS = { radius: 6,  color: 'red' }
const MOON  = { radius: 4,  color: 'grey' }

const SUN_POS = new Vec(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
const SUN_ORBIT_RADIUS = SUN.radius * 2.5;
const SUN_ORBIT_COLOR = 'black';
const EARTH_ORBIT_RADIUS = 5;


// Preset World
const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');

CANVAS.width = CANVAS_WIDTH;
CANVAS.height = CANVAS_HEIGHT;
CANVAS.style.width = WORLD_WIDTH + 'px';
CANVAS.style.height = WORLD_HEIGHT + 'px';
CANVAS.style.border = '1px solid black';
CANVAS.getContext('2d').scale(2,2);

// WorldState is a Number
// interpreation: representing the number of clock ticks
// since the simulation was started.

// draws circle given
// pos x, y
// raidus r
// color c
// fill circle f
function drawCircle(x, y, r, c, f) {
  CTX.beginPath();
  CTX.arc(x, y, r, 0, 2 * Math.PI);
  CTX.strokeStyle = c;
  CTX.fillStyle = c;
  if (f == true) {
    CTX.fill();
  } else {
    CTX.stroke();
  }
}

// clears scene
function clearWorld() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
}

// draws multiple orbits given n
function drawOrbits(n) {
  for (let i = 0; i < n; i++) {
    drawCircle(
      SUN_POS.x, SUN_POS.y,
      SUN_ORBIT_RADIUS + (SUN.radius + 5) * i,
      SUN_ORBIT_COLOR,
      false
    );
  }
}

function drawGrid(x1, x2, y1, y2, n) {
  if (n == 0) { return }

  let midX = x1 + (x2 - x1) / 2;
  let midY = y1 + (y2 - y1) / 2;

  CTX.strokeStyle = 'grey';

  // draw horizontal line
  CTX.beginPath();
  CTX.moveTo(x1, midY);
  CTX.lineTo(x2, midY);
  CTX.stroke();

  // draw vertical line
  CTX.beginPath();
  CTX.moveTo(midX, y1);
  CTX.lineTo(midX, y2);
  CTX.stroke();

  drawGrid(x1, midX, y1, midY, n - 1); // 1st square
  drawGrid(midX, x2, y1, midY, n - 1); // 2nd square
  drawGrid(x1, midX, midY, y2, n - 1); // 3rd square
  drawGrid(midX, x2, midY, y2, n - 1); // 4rd square
}

function drawCelestialBody(obj, pos) {
  drawCircle(pos.x, pos.y, obj.radius, obj.color, true);
}

// draws world
function draw(ws) {
  clearWorld();
  drawCelestialBody(SUN, SUN_POS);
  drawOrbits(3);
  drawCelestialBody(VENUS, planetPos(SUN_POS, SUN_ORBIT_RADIUS, ws / 10000.0));
  let earthPos = planetPos(SUN_POS, 30 + SUN_ORBIT_RADIUS, ws / 15000.0);
  drawCelestialBody(EARTH, earthPos);
  drawCelestialBody(MOON, planetPos(earthPos, 10 + EARTH_ORBIT_RADIUS, ws / 5000.0));
  drawCelestialBody(MARS, planetPos(SUN_POS, 60 + SUN_ORBIT_RADIUS, ws / 20000.0));
  // drawGrid(0, WORLD_WIDTH, 0, WORLD_HEIGHT, 3);
}

// converts radians to degrees
function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

// Vec, Number, Number -> Vec
// calcs planet position given
// Barrycenter  bc
// Orbit Radius r
// Time         t
function planetPos(bc, r, t) {
  return new Vec(
    bc.x + r * Math.sin(radToDeg(t)),
    bc.y + r * Math.cos(radToDeg(t))
  )
}

// moves celestial bodies for every clock tick
function tick(ws) {
  return ws + 1;
}

// runs simulation
function bigBang(ws, onDraw, onTick) {
  requestAnimationFrame(function() {
    onDraw(ws);
    bigBang(onTick(ws), onDraw, onTick)
  });
}

bigBang(0, draw, tick);
