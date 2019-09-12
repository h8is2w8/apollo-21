// import { radToDeg } from 'helpers.js';

// Constants

const ORBIT_COLOR = 'black';


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

// Represents
// - r is a Number
// - orbitR is a Number
// - color is a Color (define color enumerations)
// - drawOrbits if a Bool
// - satellites is an Array of CelestialObject
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

// Rocket, KeyEvent -> Rocket
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

module.exports.Vec = Vec;
module.exports.Rocket = Rocket;
module.exports.CelestialObject = CelestialObject;
module.exports.moveRocket = moveRocket;
module.exports.bigBang = bigBang;


// TODO: define orbital velocity computation
// - https://en.wikipedia.org/wiki/Orbital_speed
// - https://www.astronomynotes.com/gravappl/s8.htm
//
// IDEA: create it as part of Celestial Body Struct
//
// Body, Body -> Number
// computes orbital velocity of a celectial body from the barrycenter and its distance.
function orbitalVelocity(body, barrycenter, distance) {
  // v = Math.sqrt(G * M / r)
  // where M is barrycenter mass
  //       G is a ?
  //       r is a distance of a body from barrycenter
  return 1;
}

// WorldState, KeyEvent -> WorldState
function move(ws, ke) {
  switch (ke) {
    case 37: // arrow left

      break;
    case 38: // arrow up

      break;
    case 39: // arrow right

      break;
    case 40: // arrow down

      break;
    default:
      return ws;
  }
}
