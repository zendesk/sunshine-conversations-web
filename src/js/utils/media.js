export function isImageUploadSupported() {
    // to be improved
    return true;
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

export function resizeImage(file) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img');
        img.onload = () => resolve(img);
        img.onerror = reject;
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.onerror = reject;

        reader.readAsDataURL(file);
    }).then((img) => {
        const canvas = document.createElement('canvas');

        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        var MAX_WIDTH = 1280;
        var MAX_HEIGHT = 1280;
        var width = img.width;
        var height = img.height;

        if (width > height) {
            if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        } else {
            if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }

        const resizingCanvas = document.createElement('canvas');
        resizingCanvas.width = width;
        resizingCanvas.height = height;
        var resizingCtx = resizingCanvas.getContext('2d');
        resizingCtx.drawImage(img, 0, 0, width, height);

        return resizingCanvas.toDataURL('image/jpeg', 0.75);
    });
}
