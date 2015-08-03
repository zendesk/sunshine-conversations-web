var $ = require('jquery');
var urljoin = require('urljoin');

var ROOT_URL = 'https://sdk.supportkit.io';
module.exports.rootUrl = ROOT_URL;

// State params set by main
module.exports.appToken = undefined;
module.exports.jwt = undefined;
module.exports.appUserId = undefined;

module.exports._rest = function(method, path, body) {
    var deferred = $.Deferred();
    var headers = {
        'app-token': this.appToken
    };

    if (this.jwt) {
        headers.Authorization = 'Bearer ' + this.jwt;
    }

    $.ajax({
        url: urljoin(this.rootUrl, path),
        type: method,
        headers: headers,
        data: JSON.stringify(body),
        contentType: 'application/json',
        success: function(res) {
            deferred.resolve(res);
        },
        error: function(xhr) {
            if (method === 'PUT' && xhr.status === 200) {
                deferred.resolve(xhr);
            } else {
                deferred.reject(xhr);
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

module.exports.reset = function() {
    delete this.appToken;
    delete this.jwt;
    delete this.appUserId;
};
