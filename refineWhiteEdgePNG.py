def noTransparentNeighbors(pix, x, y, r):
    res = 0
    for i in range(x-r, x+r+1):
        for j in range(y-r, y+r+1):
            try:
                if pix[i][j][-1] == 0:
                    res += 1
            except IndexError:
                pass
    return res

def refine(pix, x, y):
    if noTransparentNeighbors(pix, x, y, 1) == 0 or \
            (pix[x][y][-1] != 0 and \
             (pix[x][y][0] < 25 or pix[x][y][1] < 70 or \
             pix[x][y][2] < 120)):
        return pix[x][y]
    return (255, 255, 255, 0)

def refineEdge():
    from PIL import Image

    filename = "clip.png"
    img = Image.open(filename)
    width, height = img.size
    pixels = img.load();
    pix = [[(0,0,0,0) for _ in range(height)]
           for _ in range(width)]
    for x in range(width):
        for y in range(height):
            pix[x][y] = pixels[x,y]
    for x in range(width):
        for y in range(height):
            newpix = refine(pix, x, y)
            img.putpixel((x, y), newpix)
    img.save("test-output.png")
