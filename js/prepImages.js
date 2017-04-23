// Prepare all the images and GIF frames.
// TOFIX: failure to load the images for the first time to load the webpage.

nGIFs = 8;
for (var i = 0; i<nGIFs; i++) {
	document.write(" <div style=\"display:none;\"> \
    <img id=\"tmp"+i+"\" src=\"tmp-"+i+".gif\"> \
    </div> \
	");
}
// Deprecated
nPNGs = 0; 
for (var i = 1; i<=nPNGs; i++) {
	document.write(" <div style=\"display:none;\"> \
    <img id=\"cloud"+i+"\" src=\"clouds/cloud"+i+".png\"> \
    </div> \
	");
}
nSVGs = 80;
nImages = nPNGs + nSVGs;
for (var i = nPNGs+1; i<=nImages; i++) {
	var baseFreq = 0.01+0.04 * Math.random();
	var height = ~~(30 + 60 * Math.random());
	var nOctaves = ~~(2 + 5 * Math.random());
	var svgString = "\
	<svg width=\"260\" height=\"260\" viewBox=\"0 0 260 260\" \
     xmlns=\"http://www.w3.org/2000/svg\"> \
  <filter id=\"displacementFilter\"> \
    <feTurbulence type=\"turbulence\" baseFrequency=\""+baseFreq+"\" \
        numOctaves=\""+nOctaves+"\" result=\"turbulence\"/> \
    <feDisplacementMap in2=\"turbulence\" in=\"SourceGraphic\" \
        scale=\"30\" xChannelSelector=\"G\" yChannelSelector=\"B\"/> \
  </filter> \
  <defs> \
	<radialGradient id=\"cloudGradient\"> \
      <stop offset=\"0%\" stop-color=\"rgba(240, 240, 240, .7)\"/> \
	  <stop offset=\"50%\" stop-color=\"rgba(220, 220, 220, .3)\"/> \
      <stop offset=\"100%\" stop-color=\"rgba(190, 190, 190, .0)\"/> \
    </radialGradient> \
  </defs> \
  <ellipse cx=\"100\" cy=\""+height+"\" rx=\"100\" ry=\""+height+"\" \
      style=\"filter: url(#displacementFilter); fill: url(#cloudGradient)\"/> \
</svg>";
	document.write(" <div style=\"display:none;\"> \
	<img id=\"cloud"+i+"\" src = \"data:image/svg+xml;base64," 
	+window.btoa(svgString)+
    "\"></div>");
}
  