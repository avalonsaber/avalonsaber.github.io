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
counter = 0;
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
// choose clouds
var clouds = [];
nImages = 20
for (var i=1; i<=nImages; i++) {
	if (Math.random()>0.5) {
		var cloud = {};
		cloud.img = document.getElementById("cloud"+i);
		cloud.dx = ~~(Math.random()*width);
		cloud.dy = ~~(Math.random()*height*0.3);
		cloud.height = ~~((0.8*height-cloud.dy)*(.5+.5*Math.random()));
		cloud.width = ~~(cloud.height/cloud.img.height*cloud.img.width);
		cloud.speed = Math.random()/10;
		clouds.push(cloud);
	}
}

ids = ["tmp0", "tmp1", "tmp1", "tmp2","tmp2",
		"tmp3", "tmp4", "tmp5", "tmp6", "tmp7",
		"tmp7", "tmp6", "tmp5", "tmp4", "tmp3",
		"tmp2", "tmp2", "tmp1", "tmp1", "tmp0"];
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
  for (var cloud of clouds) {
	  context.drawImage(cloud.img, width-((cloud.dx+counter*cloud.speed))%(width+cloud.width), cloud.dy, cloud.width, cloud.height);
  }
  // main figure
  var img = document.getElementById(ids[currentFrame]);
  var fig_width = (height-dy+10)*5/6;
  var fig_height = (height-dy+10);
  context.drawImage(img, dx, dy, fig_width, fig_height);
  
  for (var i=0; i<nFrontGrass; i++) {
    var tree = frontLawn[i];
    createGrass(context, tree.pos, height, 90, tree.height, tree.level, tree.color);
    createGrass(context, tree.pos, height, 60, tree.height*2/3, tree.level, tree.color);
    createGrass(context, tree.pos, height, 120, tree.height*2/3, tree.level, tree.color);
  }
  
  var light_img = document.getElementById("lights");
  context.drawImage(light_img, 0, 0, width, height);
  
  step += (Math.PI / 80) % Math.PI; counter++;
  if (Math.random()>.2) currentFrame = (currentFrame+1)%nFrames;
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
