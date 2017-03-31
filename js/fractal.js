//fractal clouds
// based on 
//https://github.com/kevinroast/webglshaders/blob/master/distancefield3.html

function mix(a, b, c){
	return (a+b+c)/3.0;
}

$fractal = function(){
	var width, height, canvas, ctx;
	var dataURL;
	
	this.hash = function(n){
		var x = Math.sin(n) * 43758.5453123;
		return x - Math.floor(x);
	}
	this.noise = function(x){
		var p = [Math.floor(x[0]), Math.floor(x[1])];
		var f = [x[0] - p[0], x[1] - p[1]];
		f[0] = f[0]*f[0]*(3.0-2.0*f[0]);
		f[1] = f[1]*f[1]*(3.0-2.0*f[1]);
		var n = p[0] + p[1]*57.0;
		var res = mix(mix(this.hash(n), this.hash(n+1.0), f[0]),
					mix(this.hash(n+57.0), this.hash(n+58.0), f[0]), f[1]);
		return res;
	}
	this.fractalNoise = function(xy) {
		var w = 0.7;
		var f = 0.0;
		for (var i=0; i<3; i++) {
			f += this.noise(xy) * w;
			w *= 0.5;
			xy[0] *= 2.333;
			xy[1] *= 2.333;
		}
		return f;
	}
	this.init = function(cv, w, h) {
		width = w;
		height = h;
		canvas = cv;
		ctx = canvas.getContext("2d");

		for (var x = 0; x < width; x++) {
			for (var y = 0; y < height; y++) {
				var oldcolor = ctx.getImageData(x, y, 1, 1).data;
				var oldred = oldcolor[0];
				var oldgreen = oldcolor[1];
				var oldblue = oldcolor[2];
				var xy = [x, y];
				var c = this.clamp(this.fractalNoise(xy) + randn_bm()*0.01);
				var red = ~~((oldred+(.55+c)/2 * 256)/2);
				var green = ~~((oldgreen+(.55+c)/2 * 256)/2);
				var blue = ~~((oldblue+255)/2);
				ctx.fillStyle = "rgb("+red+","+green+","+blue+")";
				ctx.fillRect(x, y, 1, 1);
			}
		}
		dataURL = canvas.toDataURL();
		document.getElementById('frame').src = dataURL;
		
		this.draw();
	}
	this.draw = function() {
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(document.getElementById('frame'), 0, 0, canvas.width, canvas.height);
	}
	this.clamp = function(val) {
		return (val < 0) ? 0 : (val > 1) ? 1 : val;
	}
}