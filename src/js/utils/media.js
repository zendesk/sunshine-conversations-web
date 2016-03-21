import loadImage from 'lib/load-image';

export function isImageUploadSupported() {
    // check for features used in the image upload
    let isSupported = ['atob', 'Blob', 'Uint8Array', 'File', 'FileReader'].every((feature) => {
        return typeof global[feature] !== 'undefined';
    });

    if (isSupported) {
        const canvas = document.createElement('canvas');
        isSupported = typeof canvas.toDataURL === 'function';
    }

    return isSupported;
}

export function getBlobFromDataUrl(dataUrl) {
    const blobBin = atob(dataUrl.split(',')[1]);
    const array = [];

    for (let i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], {
        type: 'image/jpeg'
    });
}

export function isFileTypeSupported(filetype) {
    return filetype.startsWith('image/');
}

export function resizeImage(file) {
    return new Promise((resolve) => {
        loadImage.parseMetaData(file, (data) => {
            resolve(data.exif && data.exif.get('Orientation'));
        });
    }).then((orientation) => {
        const MAX_WIDTH = 1280;
        const MAX_HEIGHT = 1280;
        return new Promise((resolve, reject) => {
            loadImage(file, (img) => {
                if (img.type === 'error') {
                    reject();
                } else {
                    resolve(img);
                }
            }, {
                maxWidth: MAX_WIDTH,
                maxHeight: MAX_HEIGHT,
                canvas: true,
                orientation
            });
        });
    }).then((canvas) => {
        return canvas.toDataURL('image/jpeg');
    });
}
