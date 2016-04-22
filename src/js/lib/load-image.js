import 'blueimp-load-image/js/load-image-exif';
import 'blueimp-load-image/js/load-image-orientation';
import loadImage from 'blueimp-load-image/js/load-image';

const renderImageToCanvas = loadImage.renderImageToCanvas;
// monkey patch loadImage to use a white background
loadImage.renderImageToCanvas = (
    canvas,
    img,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destX,
    destY,
    destWidth,
    destHeight
) => {
    const context = canvas.getContext('2d');
    context.beginPath();
    context.rect(0, 0, destWidth, destHeight);
    context.fillStyle = '#fff';
    context.fill();
    return renderImageToCanvas(
        canvas,
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        destX,
        destY,
        destWidth,
        destHeight
    );
};


export default loadImage;
