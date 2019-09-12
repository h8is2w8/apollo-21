import { radToDeg } from './helpers.js';

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

// Represents any celestial body
// - Radius r is a Number
// - Orbit radius orbitR is a Number
// - Color c is a HTML Color Name String
// - Position pos is a Vec
// - satellites is an Array of CelestialObject
// - drawOrbits is a Bool
class CelestialObject {
  constructor({
    r, orbitR, c,
    pos = new Vec(0, 0),
    satellites = [],
    drawOrbits = false
  }) {
    this.pos = pos;
    this.r = r;
    this.orbitR = orbitR;
    this.c = c;
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
  constructor(sun, player, time) {
    this.sun = sun;
    this.player = player;
    this.time = time;
  }
}

// Rocket, KeyEvent -> Rocket
function moveRocket(rocket, time) {
  return new Rocket(
    // new Vec(rocket.pos.x + time, rocket.pos.y + time),
    new Vec(time, time),
    rocket.v
  );
}

// TODO: remove mutation
function moveSolarSystem(obj, time) {
  obj.satellites.forEach((s, i) => {
    if (s) {
      const distance = obj.r + obj.orbitR * (i + 1);
      const speed = time / (5000.0 * (i + 1));
      s.pos = satellitePos(obj.pos, distance, speed);
      moveSolarSystem(s, time * 5);
    }
  });

  return obj;
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

// WorldState -> WorldState
// computes the next WorldState for every clock tick
function tick(ws) {
  const newTime = ws.time + 1;
  return new WorldState(
    moveSolarSystem(ws.sun, newTime),
    moveRocket(ws.player, newTime),
    newTime
  );
}

// runs simulation from given WorldState
function bigBang(ws, onDraw, onTick) {
  requestAnimationFrame(function() {
    onDraw(ws);
    bigBang(onTick(ws), onDraw, onTick);
  });
}

export {
  Vec, Rocket, WorldState, CelestialObject,
  moveRocket, bigBang, tick
}
