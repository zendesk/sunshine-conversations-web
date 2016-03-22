var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf-8');
var embedded = fs.readFileSync(path.resolve(__dirname, '../src/embedded.html'), 'utf-8');

function SimpleRenderer(options) {
    this.html = (options.embedded ? embedded : html)
        .replace('SCRIPT_URL', options.scriptUrl)
        .replace('ROOT_URL', options.data.ROOT_URL || '')
        .replace('APP_TOKEN', options.data.APP_TOKEN || '')
        .replace('GIVEN_NAME', options.data.GIVEN_NAME || '')
        .replace('SURNAME', options.data.SURNAME || '')
        .replace('EMAIL', options.data.EMAIL || '')
        .replace('USER_ID', options.data.USER_ID || '')
        .replace('PROPERTIES', JSON.stringify(options.data.PROPERTIES || {}))
        .replace('JWT', options.data.JWT || '');
}

SimpleRenderer.prototype.render = function(_path, _readItems, callback) {
    callback(null, this.html);
};

module.exports = SimpleRenderer;
