// WorldState ?

// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const WORLD_WIDTH = CANVAS_WIDTH / 2;
const WORLD_HEIGHT = CANVAS_HEIGHT / 2;
const SUN_RADIUS = 25;
const SUN_X_POS = WORLD_WIDTH / 2
const SUN_Y_POS = WORLD_HEIGHT / 2
const SUN_COLOR = 'orange';
const SUN_ORBIT_RADIUS = SUN_RADIUS * 2;
const SUN_ORBIT_COLOR = 'black';
const EARTH_RADIUS = 5;
const EARTH_COLOR = 'blue';

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
  for (var i = 0; i < n; i++) {
    drawCircle(
      SUN_X_POS, SUN_Y_POS,
      SUN_ORBIT_RADIUS + SUN_RADIUS * i,
      SUN_ORBIT_COLOR,
      false
    );
  }
}

function drawGrid(x1, x2, y1, y2, n) {
  if (n == 0) { return }

  var midX = x1 + (x2 - x1) / 2;
  var midY = y1 + (y2 - y1) / 2;

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

// draws world given WS
function draw(ws) {
  clearWorld();
  drawCircle(SUN_X_POS, SUN_Y_POS, SUN_RADIUS, SUN_COLOR, true);
  drawOrbits(2);
  drawCircle(ws.x, ws.y, EARTH_RADIUS, EARTH_COLOR, true);
  drawGrid(0, WORLD_WIDTH, 0, WORLD_HEIGHT, 3);
}

// converts radians to degrees
function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

// changes Earth position
function tick(time) {
  return {
    x: SUN_X_POS + SUN_ORBIT_RADIUS * Math.sin(radToDeg(time / 100000.0)),
    y: SUN_Y_POS + SUN_ORBIT_RADIUS * Math.cos(radToDeg(time / 100000.0))
  };
}

// runs simulation
function bigBang(ws, onDraw, onTick) {
  requestAnimationFrame(function(time) {
    onDraw(ws);
    var newWS = onTick(time);
    bigBang(newWS, onDraw, onTick)
  });
}

bigBang(
  { x: SUN_X_POS, y: SUN_Y_POS + SUN_ORBIT_RADIUS },
  draw,
  tick
);
