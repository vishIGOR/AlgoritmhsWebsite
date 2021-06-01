class Point {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 7;
  }
}

/* function euqlidDist(p1, p2){
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
function squareuqlidDist(p1, p2){
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
}
function manhetnDist(p1, p2){
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}
function chebDist(p1, p2){
    return Math.max(Math.abs(p1.x - p2.x),Math.abs(p1.y - p2.y));
}
 */

function addPoint() {
  let p = new Point(mouse.x, mouse.y, "#00eaff");
  points.push(p);
  drawPoint(p);
}

function randomPoint() {
  return new Point(
    randomize(0, canvas.width),
    randomize(0, canvas.height),
    randomColor()
  );
}

function randomColor() {
  return colors[randomize(0, 12)];
}

function randomize(min, max) {
  return min + Math.floor(Math.random() * Math.floor(max));
}

// UI

function drawPoints(pts) {
  pts.forEach((p) => {
    drawPoint(p);
  });
}

function drawPoint(p) {
  context.beginPath();
  context.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  context.fillStyle = p.color;
  context.fill();
}

function clearCanvas() {
  canvas.width = canvas.width;
}

function createMouse(element) {
  const mouse = {
    x: 0,
    y: 0,
  };

  element.addEventListener("mousemove", mouseMoves);

  function mouseMoves(event) {
    const rect = element.getBoundingClientRect();
    mouse.x = event.clientX - rect.left - 4;
    mouse.y = event.clientY - rect.top - 4;
  }

  return mouse;
}

const colors = [
  "aqua",
  "black",
  "blue",
  "fuchsia",
  "green",
  "lime",
  "maroon",
  "navy",
  "purple",
  "#f00",
  "#f09",
  "#9d00ff",
  "#1500ff",
  "#00e1ff",
  "№0f7",
  "#eaff00",
  "#f80",
  "#874444",
  "#44876e",
  "tan",
  "yellow",
];
