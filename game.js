// WorldState ?

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

const SUN_POS = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }
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
  let ss = calcSolarSystemPos(ws);
  drawCelestialBody(VENUS, ss.venusPos);
  drawCelestialBody(EARTH, ss.earthPos);
  drawCelestialBody(MOON, ss.moonPos);
  drawCelestialBody(MARS, ss.marsPos);
  // drawGrid(0, WORLD_WIDTH, 0, WORLD_HEIGHT, 3);
}

// converts radians to degrees
function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

// calcs planet position given gravity center x,y, radius r, time t
function planetPos(x, y, r, time) {
  return {
    x: x + r * Math.sin(radToDeg(time)),
    y: y + r * Math.cos(radToDeg(time))
  }
}

// calcs celestial bodies position in Solar System from ws
function calcSolarSystemPos(ws) {
  let earthPos = planetPos(SUN_POS.x, SUN_POS.y, 30 + SUN_ORBIT_RADIUS, ws / 15000.0);

  return {
    earthPos: earthPos,
    venusPos: planetPos(SUN_POS.x, SUN_POS.y, SUN_ORBIT_RADIUS, ws / 10000.0),
    marsPos: planetPos(SUN_POS.x, SUN_POS.y, 60 + SUN_ORBIT_RADIUS, ws / 20000.0),
    moonPos: planetPos(earthPos.x, earthPos.y, 10 + EARTH_ORBIT_RADIUS, ws / 5000.0)
  };
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
