var $ = require('jquery'),
    urljoin = require('urljoin');

var ROOT_URL = 'http://10.0.2.2:8091';
module.exports.rootUrl = ROOT_URL;

// State params set by main
module.exports.appToken = undefined;
module.exports.appUserId = undefined;

module.exports._rest = function(method, path, body) {
    $.support.cors = true;
    var deferred = $.Deferred();
    $.ajax({
        url: urljoin(this.rootUrl, path),
        type: method,
        headers: {
            'app-token': this.appToken
        },
        data: JSON.stringify(body),
        contentType: 'application/json',
        success: function(res) {
            deferred.resolve(res);
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log('xhr:', xhr);
            console.log('textStatus:', textStatus);
            console.log('errorThrown:', errorThrown.toString());
            console.log('xhr.status:', xhr.status);
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
