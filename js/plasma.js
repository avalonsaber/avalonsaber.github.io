/***************************************************************************
 * Do What THe Fuck You Want To Public Licence 2                           *
 *                                                                         *
 * JavaScript implementation by Piotr Rochala (http://rocha.la/)           *
 * Based on C# work of Serge Meunier (http://www.smokycogs.com/)           *
 *                                                                         *
 * Check this code in action on http://rocha.la/javascript-plasma-fractal  *
 *                                                                         *
 **************************************************************************/

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
 
//plasma.js
var $plasma = function()
{
	var roughness, totalSize;
	var width, height, canvas, ctx;
	var types = { PLASMA: 0, CLOUD: 1 };
	var dataURL;
	
	this.colorModif = [255, 255, 255];

	this.init = function(cv, w, h, rough, type)
	{
		//initialize local variables
		width = w;
		height = h;
		roughness = rough;
		plasmaType = type;
		canvas = cv;
		canvas.width = width;
		canvas.height = height;
        ctx = canvas.getContext("2d");

		var fractal = new $fractal();
		//generate points
		this.points = this.getPoints(width, height, roughness);
		
		for (var x = 0; x < width; x++)
		{
			for (var y = 0; y < height; y++)
			{
				//get color for each pixel
				var color = this.getColor(this.points[x][y], plasmaType);
				var xy = [x, y];
				var c = clamp(fractal.fractalNoise(xy) + randn_bm()*0.01);
				var red = ~~((color.r+(.55+c)/2 * 256)/2);
				var green = ~~((color.g+(.55+c)/2 * 256)/2);
				var blue = ~~((color.b+255)/2);
				ctx.fillStyle = "rgb("+red+","+green+","+blue+")";
				ctx.fillRect(x, y, 1, 1);
			}
		}
		dataURL = canvas.toDataURL();
		document.getElementById('frame').src = dataURL;
		
		//draw points
		this.draw();
	}
	
	this.draw = function()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(document.getElementById('frame'), 0, 0, canvas.width, canvas.height);
	}
	
	this.getPoints = function(width, height, rough)  
	{  
		var p1, p2, p3, p4;  
		var points = [];
		for (var x = 0; x <= width; x++)
		{
			points[x] = [];
			for (var y = 0; y <= height; y++) points[x][y] = -1;
		}
		//give corners random colors
		p1 = Math.random();
		points[0][0] = p1;
		p2 = Math.random();
		points[width-1][0] = p2;
		p3 = Math.random();
		points[width-1][height-1] = p3;
		p4 = Math.random();
		points[0][height-1] = p4;
		roughness = rough;
		totalSize = width + height;
		this.splitRect(points, 0, 0, width, height, p1, p2, p3, p4);
		return points;
	}

	this.splitRect = function(points, x, y, width, height, p1, p2, p3, p4)
	{  
		var side1, side2, side3, side4, center;
		var transWidth = ~~(width / 2);
		var transHeight = ~~(height / 2);
		var xm = x+transWidth;
		var ym = y+transHeight;
		var xr = x+width;
		var yr = y+height;
		
		//as long as square is bigger than a pixel..
		if (width > 1 || height > 1)
		{  
			//center is just an average of all 4 corners plus a random number
			//it is also possible that a middle point was moved out of bounds
			//so correct it by normalizing
			if (points[xm][ym] === -1) {
				center = ((p1 + p2 + p3 + p4) / 4);
				center += this.shift(transWidth + transHeight);
				center = this.normalize(center);
				points[xm][ym] = center;
			}else center = points[xm][ym];
			
			//sides are averages of the connected corners plus a random number
			//p1----p2
			//|     |
			//p4----p3
			if (points[xm][y] === -1){
				side1 = ((p1 + p2) / 2);
				side1 += this.shift(transWidth + transHeight);
				side1 = this.normalize(side1);
				points[xm][y] = side1;
			}else side1 = points[xm][y];
			if (points[xr][ym] === -1) {
				side2 = ((p2 + p3) / 2);
				side2 += this.shift(transWidth + transHeight);
				side2 = this.normalize(side2);
				points[xr][ym] = side2;
			}else side2 = points[xr][ym];
			if (points[xm][yr] === -1) {
				side3 = ((p3 + p4) / 2);
				side3 += this.shift(transWidth + transHeight);
				side3 = this.normalize(side3);
				points[xm][yr] = side3;
			}else side3 = points[xm][yr];
			if (points[x][ym] === -1) {
				side4 = ((p4 + p1) / 2);
				side4 += this.shift(transWidth + transHeight);
				side4 = this.normalize(side4);
				points[x][ym] = side4;
			}else side4 = points[x][ym];
			
			//recursive operations for each of 4 new squares created
			this.splitRect(points, x, y, transWidth, transHeight, p1, side1, center, side4);
			this.splitRect(points, x + transWidth, y, width - transWidth, transHeight, side1, p2, side2, center);
			this.splitRect(points, x + transWidth, y + transHeight, width - transWidth, height - transHeight, center, side2, p3, side3);
			this.splitRect(points, x, y + transHeight, transWidth, height - transHeight, side4, center, side3, p4);
		}
		else 
		{
			//when last square is just a pixel, simply average it from the corners
			points[x][y]= (p1 + p2 + p3 + p4) / 4;
		}
	}

	this.normalize = function(val)  
	{  
		return (val < 0) ? 0 : (val > 1) ? 1 : val;
	}
  
	this.shift = function(smallSize)
	{ 
		return 0.1*randn_bm() * smallSize / totalSize * roughness;
	}
	
	this.getColor = function(c, type)
	{
		var red = 0, green = 0, blue = 0;
	
		switch (type)
		{
			case types.CLOUD:
				//if (c < 0.3)
				//	red = c;
				red = green = c;

				blue = 1;
				break;
			case types.PLASMA:
				//r
				if (c < 0.5)
					red = c * 2;
				else
					red = (1.0 - c) * 2;

				//g
				if (c >= 0.3 && c < 0.8)
					green = (c - 0.3) * 2;
				else if (c < 0.3)
					green = (0.3 - c) * 2;
				else
					green = (1.3 - c) * 2;

				//b
				if (c >= 0.5)
					blue = (c - 0.5) * 2;
				else
					blue = (0.5 - c) * 2;
				break;
			default:
				red = green = blue = c;
				break;
		}
		return {
			r: ~~(red * this.colorModif[0]),
			g: ~~(green * this.colorModif[1]),
			b: ~~(blue * this.colorModif[2])
		};
	}
		
	return this;
}