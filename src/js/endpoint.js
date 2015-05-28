var ROOT_URL = 'https://sdk.supportkit.io';

var $ = require('jquery');

module.exports.rootUrl = ROOT_URL;

// State params set by main
module.exports.appToken = undefined;
module.exports.appUserId = undefined;

module.exports._rest = function(method, path, body) {
    var deferred = $.Deferred();
    $.ajax({
        url: this.rootUrl + path,
        type: method,
        headers: {
            'Content-Type': 'application/json',
            'app-token': this.appToken
        },
        data: JSON.stringify(body),
        contentType: 'application/json',
        success: function(res) {
            deferred.resolve(res);
        },
        error: function(err) {
            if (method === 'PUT' && err.status === 200) {
                deferred.resolve(err);
            } else {
                deferred.reject(err);
            }
        }
    });
    return deferred;
};

module.exports.get = function(path, body) {
    return this._rest('GET', path, body);
};

module.exports.post = function(path, body) {
    return this._rest('POST', path, body);
};

module.exports.put = function(path, body) {
    return this._rest('PUT', path, body);
};