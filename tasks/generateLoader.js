'use strict';
const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.join(__dirname, '../src/loader/index.js'), 'utf8').toString();

if (process.env.WEBLOADER_URL) {
    content = content.replace(
        '\'https://\' + appId + \'.webloader.smooch.io/\'',
        `'${process.env.WEBLOADER_URL}'`
    );
}

if (process.env.GLOBAL_VARIABLE_NAME) {
    content = content.replace(
        '\'Smooch\'',
        `'${process.env.GLOBAL_VARIABLE_NAME}'`
    );
}

console.log(content);
