from PIL import Image, ImageChops

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

def crop_with_alpha(path):
    im = Image.open(path)
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    
    # Try getting bbox from alpha channel
    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
        im.save(path)
        print(f"Cropped to alpha: {bbox}")
        return

    # Fallback to trim based on top-left pixel
    trimmed = trim(im)
    trimmed.save(path)
    print("Cropped based on background color")

if __name__ == "__main__":
    crop_with_alpha(r"c:\Users\Ahmed\Desktop\work\next.js\mfood\public\logo.png")
