import Vec from './vec';
import Screen from './screen';
import { degToRad, radToDeg } from './helpers';
import bigBang from './bigBang';


// World config

const WORLD_WIDTH = 400;
const WORLD_HEIGHT = 400;

const ACCEL = 0.04;
const MAX_SPEED = 2;
const ROT_SPEED = degToRad(3);


// Preset scene

const CANVAS = document.getElementById('canvas');
const SCREEN = new Screen(CANVAS, WORLD_WIDTH, WORLD_HEIGHT);


// Structs

function WorldState({ rocket, sun, time = 0, drawGrid = false }) {
  this.time = time;
  this.rocket = rocket;
  // TODO: consider to move this at bigBang or CelectialObject init
  this.sun = updateCelestialBody(sun, time);
  this.drawGrid = drawGrid;
}

function Rocket({
  p1, p2, p3, angle = 0,
  dir   = new Vec(1, 0),
  speed = 0.1,
  color = 'navy',
}) {
  this.p1  = p1;
  this.p2  = p2;
  this.p3  = p3;
  this.dir = dir;
  this.angle = angle;
  this.speed = speed;
  this.color = color;
}

function CelestialObject({
  name, r, orbitR, color,
  pos        = new Vec(0, 0),
  drawOrbits = false,
  satellites = []
}) {
  this.name = name;
  this.r   = r;
  this.pos = pos;
  this.color = color;
  this.orbitR = orbitR;
  this.drawOrbits = drawOrbits;
  this.satellites = satellites;
}


// Game cogs

// Rocket -> Rocket
function updateRocket(rocket) {
  const {p1, p2, p3} = rocket;
  const center = new Vec((p1.x + p2.x + p3.x) / 3, (p1.y + p2.y + p3.y) / 3);
  const vel = rocket.dir.mult(rocket.speed);
  const tetha = rocket.angle;

  return new Rocket({
    ...rocket,
    p1: p1.minus(center).rotate(tetha).plus(center).plus(vel),
    p2: p2.minus(center).rotate(tetha).plus(center).plus(vel),
    p3: p3.minus(center).rotate(tetha).plus(center).plus(vel),
    angle: 0
  });
}

// TODO: Polish function
// - remove mutation
// - subtitue 5000.0 with constant
// - subtitue 5 with constant
//
// Number -> CelestialObject
// recursively updates object with its satellites according to time
function updateCelestialBody(body, time) {
  body.satellites.forEach((s, i) => {
    if (s) {
      const distance = body.r + body.orbitR * (i + 1);
      const speed = time / (5000.0 * (i + 1));
      s.pos = satellitePos(body.pos, distance, speed);
      updateCelestialBody(s, time * 5);
    }
  });
  return body;
}

// Vec, Number, Number -> Vec
// calcs satellite position given
// Barrycenter  bc is a Vec
// Orbit Radius r  is a Number
// Time         t  is a Number
function satellitePos(bc, r, t) {
  return new Vec(
    bc.x + r * Math.sin(radToDeg(t)),
    bc.y + r * Math.cos(radToDeg(t))
  );
}

// WorldState -> Null
// draws the whole world from ws
function draw(ws) {
  SCREEN.draw(ws);
}

// WorldState -> WorldState
function tick(ws) {
  const newTime = ws.time + 1;
  return new WorldState({
    ...ws,
    time: newTime,
    sun: updateCelestialBody(ws.sun, newTime),
    rocket: updateRocket(ws.rocket, newTime)
  });
}

// WorldState, KeyStore -> WorldState
// computes new WorldState according to keypress
function control(ws, ks) {
  if (ks.ArrowUp || ks.ArrowDown || ks.ArrowLeft || ks.ArrowRight) {
    return new WorldState({
      ...ws,
      rocket: updateRocketVel(ws.rocket, ks)
    });
  } else {
    return ws;
  }
}

// Rocket, KeyStore -> Rocket
function updateRocketVel(rocket, ks) {
  let angle = 0;
  let accel = 0;

  if (ks.ArrowLeft)  angle -= ROT_SPEED;
  if (ks.ArrowRight) angle += ROT_SPEED;
  if (ks.ArrowDown)  accel -= ACCEL;
  if (ks.ArrowUp)    accel += ACCEL;

  const dir = rocket.dir.rotate(angle);
  const newSpeed = rocket.speed + accel;
  const speed = newSpeed < 0 ? 0 : Math.min(newSpeed, MAX_SPEED);

  return new Rocket({
    ...rocket,
    angle: angle,
    dir: dir,
    speed: speed
  });
}


bigBang({
  ws: new WorldState({
    rocket: new Rocket({
      p1: new Vec(100, 100),
      p2: new Vec(100, 110),
      p3: new Vec(120, 105)
    }),
    sun: new CelestialObject({
      name: 'Sun',
      pos: new Vec(WORLD_WIDTH / 2, WORLD_HEIGHT / 2),
      r: 25, orbitR: 40, color: 'orange',
      drawOrbits: true,
      satellites: [
        new CelestialObject({ name: 'Venus', r: 8, orbitR: 3, color: 'red' }),
        new CelestialObject({
          name: 'Earth', r: 10, orbitR: 10, color: 'blue',
          drawOrbits: true,
          satellites: [
            new CelestialObject({ name: 'Moon', r: 5, orbitR: 1, color: 'grey' })
          ]
        }),
        new CelestialObject({ name: 'Jupiter', r: 12, orbitR: 5, color: 'brown' }),
      ]
    })
  }),
  onDraw: draw,
  onTick: tick,
  onKey:  control
});
