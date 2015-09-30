'use strict';
var _ = require('underscore');


function autolink(text, options) {
    options || (options = {});

    var pattern = /(^|[\s\n]|<br\/?>)((?:[a-z]*):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;
    var linkAttributes = _.map(options, function(value, key) {
        return key + '="' + value + '"';
    }).join(' ');

    return text.replace(pattern, '$1<a '+ linkAttributes +' href=\'$2\'>$2</a>');

}

module.exports = {
    autolink: autolink
};