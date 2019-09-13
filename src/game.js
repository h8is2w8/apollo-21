import { radToDeg, degToRad } from './helpers';
import Vec from './vec';

// Constants
const TRACKED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
const ROTATION_SPEED = degToRad(3); // Rocket rotation speed in radians
const MIN_SPEED = 0;
const MAX_SPEED = 2;
const DEFAULT_POS = new Vec(1, 0);

// Structs

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

// Represents Rocket with
// position  pos is a Vec
// direction dir is a Vec
// speed is a Number
// color c is a HTML Color Name String
class Rocket {
  constructor({
    pos, dir = DEFAULT_POS,
    speed = MIN_SPEED, c = "navy"
  }) {
    this.pos = pos;
    this.dir = dir;
    this.speed = speed;
    this.c = c;
  }

  nextPos() {
    return new Rocket({
      ...this,
      pos: this.pos.plus(this.dir.mult(this.speed))
    });
  }
}

// Represents complete state of Space Flight game
// - sun is a CelectialObject
// - player is a Rocket
// - time is a Number
// - drawGrid is Bool
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
      player: updateRocketVel(ws.player, ks)
    });
  } else {
    return ws;
  }
}

// Rocket, KeyEvent -> Rocket
// computes speed and direction for Rocket according to pressed keys
function updateRocketVel(rocket, ke) {
  let deltaDeg = 0;
  let deltaMag = 0;

  if (ke.ArrowLeft)  deltaDeg -= ROTATION_SPEED;
  if (ke.ArrowRight) deltaDeg += ROTATION_SPEED;
  if (ke.ArrowDown)  deltaMag -= 1;
  if (ke.ArrowUp)    deltaMag += 1;

  const dir = rocket.dir.rotate(deltaDeg);
  const newSpeed = rocket.speed + deltaMag;

  return new Rocket({
    ...rocket,
    dir: dir,
    speed: newSpeed < MIN_SPEED ? MIN_SPEED : Math.min(newSpeed, MAX_SPEED)
  });
}

// WorldState -> WorldState
// computes the next WorldState for every clock tick
function tick(ws) {
  const newTime = ws.time + 1;
  return new WorldState({
    ...ws,
    sun: moveSolarSystem(ws.sun, newTime),
    player: ws.player.nextPos(),
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
