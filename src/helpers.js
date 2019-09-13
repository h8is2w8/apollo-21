// Number -> Number
// converts radians to degrees
function radToDeg(rad) {
  return rad * 180 / Math.PI;
}

// Number -> Number
// converts degrees to radians
function degToRad(deg) {
  return deg * Math.PI / 180;
}

// draws circle given
// Canvas ctx
// Pos    x, y
// Raidus r
// Color  c
// Fill circle flag f
function drawCircle(ctx, x, y, r, c, f) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = c;
  ctx.fillStyle = c;
  if (f == true) {
    ctx.fill();
  } else {
    ctx.stroke();
  }
}

export { radToDeg, degToRad, drawCircle }
