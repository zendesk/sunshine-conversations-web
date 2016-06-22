'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.createMarkup = createMarkup;
exports.autolink = autolink;
exports.escapeHtml = escapeHtml;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMarkup(html) {
    return {
        __html: html
    };
}

function autolink(text, options) {
    options || (options = {});

    var pattern = /(^|[\s\n\[]|<br\/?>)((?:[a-z]*):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    var linkAttributes = (0, _keys2.default)(options).map(function (key) {
        var value = options[key];
        return key + '="' + value + '"';
    }).join(' ');

    linkAttributes && (linkAttributes += ' ');

    return text.replace(pattern, '$1<a ' + linkAttributes + 'href="$2">$2</a>');
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}