import {
  WorldState, Rocket,
  CelestialObject, Vec,
  bigBang, draw, tick
} from './game.js';

import Screen from './screen.js';

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
  pos: new Vec(WORLD_WIDTH / 2, WORLD_HEIGHT / 2),
  r: 25, orbitR: 40, color: 'orange',
  drawOrbits: true,
  satellites: [VENUS, EARTH, MARS, null]
});

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
const SCREEN = new Screen(CTX);

function drawWrold(ws) {
  SCREEN.draw(ws);
}

bigBang(new WorldState(SUN, PLAYER, 0), drawWrold, tick);
