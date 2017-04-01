// Based on HTML5 Canvas Tree in the Breeze
// Websites: http://wonderfl.net/c/9KQy and http://cssdeck.com/labs/fjqj6ifd

// Grass
label = document.getElementById("avalon");
label.width = window.innerWidth;
canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
width = canvas.width;
height = canvas.height;
context = canvas.getContext("2d");
step = 0.0;
toRadian = Math.PI / 180;

nFrontGrass = 300;
nBackGrass = 500;
frontLawn = [];
backLawn = [];
frontGrassColors = ["#2c9c00", "#dcdc00"];
for (var i=0; i<nBackGrass; i++) {
	var grass = {};
	grass.pos = Math.random()*width;
	grass.height = Math.random()/10*height;
	grass.level = Math.floor(Math.random()*2+1);
	grass.color = frontGrassColors[Math.floor(Math.random() * frontGrassColors.length)];
	backLawn.push(grass);
}
for (var i=0; i<nFrontGrass; i++) {
  var grass = {};
  grass.pos = Math.random()*width;
  grass.height = Math.random()/10*height;
  grass.level = Math.floor(Math.random()*4+1);
  grass.color = frontGrassColors[Math.floor(Math.random() * frontGrassColors.length)];
  frontLawn.push(grass);
}

ids = ["tmp0", "tmp1", "tmp2", "tmp3",
		"tmp4", "tmp5", "tmp6", "tmp7",
		"tmp7", "tmp6", "tmp5", "tmp4",
		"tmp3", "tmp2", "tmp1", "tmp0"];
nFrames = ids.length;
currentFrame = 0;
var pl = new $plasma();
pl.init(canvas, width, height, 12, 1);
setInterval(intervalHandler, 200);
function intervalHandler() {
  pl.draw();
  var dx = .1*width;
  var dy = .4*height;
  
  for (var i=0; i<nBackGrass; i++) {
	  var grass = backLawn[i];
	  createGrass(context, grass.pos, height, 90, grass.height, grass.level, grass.color);
  }
  var img = document.getElementById(ids[currentFrame]);
  context.drawImage(img, dx, dy, (height-dy+10)*5/6, (height-dy+10));
  for (var i=0; i<nFrontGrass; i++) {
    var tree = frontLawn[i];
    createGrass(context, tree.pos, height, 90, tree.height, tree.level, tree.color);
    createGrass(context, tree.pos, height, 60, tree.height*2/3, tree.level, tree.color);
    createGrass(context, tree.pos, height, 120, tree.height*2/3, tree.level, tree.color);
  }
  step += (Math.PI / 80) % Math.PI;
  currentFrame = (currentFrame+1)%nFrames;
}

function drawLine(g, n, x1, y1, x2, y2, color){
	g.beginPath();
	g.lineWidth = n > 0 ? n : 1;
	g.strokeStyle = color;
	g.moveTo(x1, y1);
	g.lineTo(x2, y2);
	g.stroke();
}

function createGrass(g, px, py, angle, len, n, c) {
  if (n > 0) {
	var omega = 4;
    angle += 3 * Math.cos(angle * toRadian);
    var angleRad = angle * toRadian;
    var x1 = px + 0.1 * len * Math.cos(angleRad);
    var y1 = py - 0.1 * len * Math.sin(angleRad);
    var x2 = px + len * Math.cos(angleRad);
    var y2 = py - len * Math.sin(angleRad);
    drawLine(g, n-1, px, py, x2, y2, c);
    var angleLeft = angle + 30;
    var angleRight = angle - 30;
    len *= 2/3;
    createGrass(g, x2, y2, angle - 3 * Math.sin(omega * step), len, n-1, c);
    createGrass(g, x1, y1, angleLeft, len*2/3, n-1, c);
    createGrass(g, x1, y1, angleRight, len*2/3, n-1, c);
    createGrass(g, x2, y2, angleLeft, len*2/3, n-1, c);
    createGrass(g, x2, y2, angleRight, len*2/3, n-1, c);
  }
}
