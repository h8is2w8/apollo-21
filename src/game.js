import { radToDeg } from './helpers.js';

// Constants
const TRACKED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

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
  constructor({ pos, v }) {
    this.pos = pos;
    this.v = v;
  }
}

// Represents complete state of Space Flight game
// - sun is a CelectialObject
// - player is a Rocket
// - time is a Number
class WorldState {
  constructor({ sun, player, time, drawGrid = false }) {
    this.sun = sun;
    this.player = player;
    this.time = time;
    this.drawGrid = drawGrid;

    moveSolarSystem(this.sun, time);
  }
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

// WorldState, KeyStore -> WorldState
// computes new WorldState according keypress
function control(ws, ks) {
  if (ks.ArrowUp || ks.ArrowDown || ks.ArrowLeft || ks.ArrowRight) {
    return new WorldState({
      ...ws,
      player: moveRocket(ws.player, ks)
    });
  } else {
    return ws;
  }
}

// Rocket, KeyEvent -> Rocket
// computes new position for Rocket according to pressed keys
function moveRocket(rocket, ke) {
  let xSpeed = 0;
  let ySpeed = 0;

  if (ke.ArrowLeft)  xSpeed -= 1;
  if (ke.ArrowRight) xSpeed += 1;
  if (ke.ArrowUp)    ySpeed -= 1;
  if (ke.ArrowDown)  ySpeed += 1;

  return new Rocket({
    ...rocket,
    pos: rocket.pos.plus(new Vec(xSpeed, ySpeed))
  });
}

// WorldState -> WorldState
// computes the next WorldState for every clock tick
function tick(ws) {
  const newTime = ws.time + 1;
  return new WorldState({
    ...ws,
    sun: moveSolarSystem(ws.sun, newTime),
    time: newTime
  });
}

// runs simulation from given WorldState
function bigBang({ ws, onDraw, onTick, onKey }) {
  const ks = (function(keys) {
    const keyStore = Object.create(null);

    function track(event) {
      if (keys.includes(event.key)) {
        keyStore[event.key] = event.type == 'keydown';
        event.preventDefault();
      }
    }

    window.addEventListener('keyup', track);
    window.addEventListener('keydown', track);

    return keyStore;
  })(TRACKED_KEYS);

  const run = function(ws, onDraw, onTick, onKey) {
    requestAnimationFrame(function() {
      onDraw(ws);
      run(onTick(onKey(ws, ks)), onDraw, onTick, onKey);
    });
  }

  run(ws, onDraw, onTick, onKey);
}

export {
  Vec, Rocket, WorldState, CelestialObject,
  bigBang, tick, control
}
