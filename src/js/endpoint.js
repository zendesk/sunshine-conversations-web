var $ = require('jquery'),
    urljoin = require('urljoin');

var ROOT_URL = 'https://sdk.supportkit.io';
module.exports.rootUrl = ROOT_URL;

// State params set by main
module.exports.appToken = undefined;
module.exports.jwtToken = undefined;
module.exports.appUserId = undefined;

module.exports._rest = function(method, path, body) {
    var deferred = $.Deferred();
    $.ajax({
        url: urljoin(this.rootUrl, path),
        type: method,
        headers: {
            'app-token': this.appToken,
            'Authorization': 'Bearer ' + this.jwtToken
        },
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
