// Prepare all the images and GIF frames.
// TOFIX: failure to load the images for the first time to load the webpage.

nGIFs = 8;
for (var i = 0; i<nGIFs; i++) {
	document.write(" <div style=\"display:none;\"> \
    <img id=\"tmp"+i+"\" src=\"tmp-"+i+".gif\"> \
    </div> \
	");
}
nPNGs = 4;
for (var i = 1; i<=nPNGs; i++) {
	document.write(" <div style=\"display:none;\"> \
    <img id=\"cloud"+i+"\" src=\"clouds/cloud"+i+".png\"> \
    </div> \
	");
}
nSVGs = 16;
nImages = nPNGs + nSVGs;
for (var i = nPNGs+1; i<=nImages; i++) {
	document.write(" <div style=\"display:none;\"> \
    <img id=\"cloud"+i+"\" src=\"clouds/cloud"+i+".svg\"> \
    </div> \
	");
}
  