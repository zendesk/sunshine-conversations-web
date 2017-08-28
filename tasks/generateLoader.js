'use strict';
const fs = require('fs');
const path = require('path');
const {minify} = require('uglify-js');

const getContent = exports.getContent = (webloaderUrl, globalVariableName) => {
    let content = fs.readFileSync(path.join(__dirname, '../src/loader/index.js'), 'utf8').toString();

    if (webloaderUrl) {
        content = content.replace(
            '\'https://\' + appId + \'.webloader.smooch.io/\'',
            `'${webloaderUrl}'`
        );
    }

    if (globalVariableName) {
        content = content.replace(
            '\'Smooch\'',
            `'${globalVariableName}'`
        );
    }

    return minify(content).code;
};


if (require.main === module) {
    // Run this if call directly from command line
    const content = getContent(process.env.WEBLOADER_URL, process.env.GLOBAL_VARIABLE_NAME);
    console.log(content);
}
