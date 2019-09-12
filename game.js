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

class CelestialObject {
  constructor({ r, orbitR, color, drawOrbits = false, satellites = [] }) {
    this.r = r;
    this.orbitR = orbitR;
    this.color = color;
    this.drawOrbits = drawOrbits;
    this.satellites = satellites;
  }
}

// Represents Rocket at position pos and velocity v
// - pos is a Vec
// - v is a Vec
class Rocket {
  constructor(pos, v) {
    this.pos = pos;
    this.v = v;
  }
}

// Represents complete state of Space Flight game
// - player is a Rocket
// - time is a Number
class WorldState {
  constructor(player, time) {
    this.player = player;
    this.time = time;
  }
}


// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const WORLD_WIDTH = CANVAS_WIDTH / 2;
const WORLD_HEIGHT = CANVAS_HEIGHT / 2;

const MOON  = new CelestialObject({ r: 5,  orbitR: 1, color: 'grey'  });
const VENUS = new CelestialObject({ r: 8,  orbitR: 3, color: 'red'   });
const MARS  = new CelestialObject({ r: 12, orbitR: 5, color: 'brown' });
const EARTH = new CelestialObject({
  r: 10, orbitR: 10, color: 'blue',
  drawOrbits: true, satellites: [MOON]
});
const SUN   = new CelestialObject({
  r: 25, orbitR: 40, color: 'orange',
  drawOrbits: true,
  satellites: [VENUS, EARTH, MARS, null]
});

const SUN_POS = new Vec(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
const ORBIT_COLOR = 'black';

// Preset World
const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');

CANVAS.width = CANVAS_WIDTH;
CANVAS.height = CANVAS_HEIGHT;
CANVAS.style.width = WORLD_WIDTH + 'px';
CANVAS.style.height = WORLD_HEIGHT + 'px';
CANVAS.style.border = '1px solid black';
CANVAS.getContext('2d').scale(2,2);

const PLAYER = new Rocket(new Vec(20, 20), new Vec(5, 5));

// WorldState is a Number
// interpreation: representing the number of clock ticks
// since the simulation was started.

// draws circle given
// Pos    x, y
// Raidus r
// Color  c
// Fill circle flag f
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

// draws orbits around an obj
function drawOrbits(obj, pos) {
  for (let i = 1; i <= obj.satellites.length; i++) {
    drawCircle(
      pos.x, pos.y,
      obj.r + obj.orbitR * i,
      ORBIT_COLOR,
      false
    );
  }
}

// draws game grid with granularity n
function drawGrid(x1, x2, y1, y2, n) {
  if (n <= 0) { return; }

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

function drawCelestialBody(obj, pos, time) {
  if (obj.drawOrbits) { drawOrbits(obj, pos) };
  drawCircle(pos.x, pos.y, obj.r, obj.color, true);

  obj.satellites.forEach(function(sat, i) {
    if (sat) {
      const distance = obj.r + obj.orbitR * (i + 1);
      const speed = time / (5000.0 * (i + 1));
      const sat_current_pos = satellitePos(pos, distance, speed);
      drawCelestialBody(sat, sat_current_pos, time * 5);
    }
  });
}

// draws rocket
function drawRocket(rocket) {
  CTX.beginPath();
  // CTX.lineWidth = "6";
  CTX.strokeStyle = "red";
  CTX.rect(rocket.pos.x, rocket.pos.y, 20, 20);
  CTX.stroke();
}

// draws world from WorldState
function draw(ws) {
  clearWorld();
  drawCelestialBody(SUN, SUN_POS, ws.time);
  drawRocket(ws.player);
  // drawGrid(0, WORLD_WIDTH, 0, WORLD_HEIGHT, 3);
}

// Number -> Number
// converts radians to degrees
function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

// Vec, Number, Number -> Vec
// calcs satellite position given
// Barrycenter  bc
// Orbit Radius r
// Time         t
function satellitePos(bc, r, t) {
  return new Vec(
    bc.x + r * Math.sin(radToDeg(t)),
    bc.y + r * Math.cos(radToDeg(t))
  );
}

// Rocket -> Rocket
// computes a new position of rocket
function moveRocket(rocket) {
  return new Rocket(
    new Vec(rocket.pos.x + 1, rocket.pos.y + 1),
    rocket.v
  );
}

// WorldState -> WorldState
// computes the next WorldState for every clock tick
function tick(ws) {
  return new WorldState(
    moveRocket(ws.player),
    ws.time + 1
  );
}

// runs simulation from given WorldState
function bigBang(ws, onDraw, onTick) {
  requestAnimationFrame(function() {
    onDraw(ws);
    bigBang(onTick(ws), onDraw, onTick);
  });
}

bigBang(0, draw, tick);
