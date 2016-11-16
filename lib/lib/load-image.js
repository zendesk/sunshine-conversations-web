'use strict';

exports.__esModule = true;

require('./blueimp-load-image/load-image-exif');

require('./blueimp-load-image/load-image-orientation');

var _loadImage = require('./blueimp-load-image/load-image');

var _loadImage2 = _interopRequireDefault(_loadImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderImageToCanvas = _loadImage2.default.renderImageToCanvas;
// monkey patch loadImage to use a white background
_loadImage2.default.renderImageToCanvas = function (canvas, img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
    var context = canvas.getContext('2d');
    context.beginPath();
    context.rect(0, 0, destWidth, destHeight);
    context.fillStyle = '#fff';
    context.fill();
    return renderImageToCanvas(canvas, img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
};

exports.default = _loadImage2.default;