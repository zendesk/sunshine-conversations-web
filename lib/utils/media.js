'use strict';

exports.__esModule = true;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.isImageUploadSupported = isImageUploadSupported;
exports.getBlobFromDataUrl = getBlobFromDataUrl;
exports.isFileTypeSupported = isFileTypeSupported;
exports.resizeImage = resizeImage;

var _loadImage = require('../lib/load-image');

var _loadImage2 = _interopRequireDefault(_loadImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isImageUploadSupported() {
    // check for features used in the image upload
    var isSupported = ['atob', 'Blob', 'Uint8Array', 'File', 'FileReader'].every(function (feature) {
        return typeof global[feature] !== 'undefined';
    });

    if (isSupported) {
        var canvas = document.createElement('canvas');
        isSupported = typeof canvas.toDataURL === 'function';
    }

    return isSupported;
}

function getBlobFromDataUrl(dataUrl) {
    var blobBin = atob(dataUrl.split(',')[1]);
    var array = [];

    for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], {
        type: 'image/jpeg'
    });
}

function isFileTypeSupported(filetype) {
    return filetype.startsWith('image/');
}

function resizeImage(file) {
    return new _promise2.default(function (resolve) {
        _loadImage2.default.parseMetaData(file, function (data) {
            resolve(data.exif && data.exif.get('Orientation'));
        });
    }).then(function (orientation) {
        var MAX_WIDTH = 1280;
        var MAX_HEIGHT = 1280;
        return new _promise2.default(function (resolve, reject) {
            (0, _loadImage2.default)(file, function (img) {
                if (img.type === 'error') {
                    reject();
                } else {
                    resolve(img);
                }
            }, {
                maxWidth: MAX_WIDTH,
                maxHeight: MAX_HEIGHT,
                canvas: true,
                orientation: orientation
            });
        });
    }).then(function (canvas) {
        return canvas.toDataURL('image/jpeg');
    });
}