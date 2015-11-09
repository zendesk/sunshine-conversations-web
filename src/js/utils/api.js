/* globals fetch: false, Promise: false */
'use strict';
var _ = require('underscore');
var endpoint = require('../endpoint');
var urljoin = require('urljoin');

function stringifyGETParams(url, data) {
    var query = '';

    for (var key in data) {
        if (data.hasOwnProperty(key) && data[key] !== null) {
            query += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }
    }
    if (query) {
        url += (~url.indexOf('?') ? '&' : '?') + query.substring(1);
    }
    return url;
}

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    var error = new Error(response.statusText);
    error.response = response;

    throw error;
}

function json(response) {
    if (response.status === 202 || response.status === 204) {
        return;
    }

    return response.json();
}

module.exports.call = function call(options) {
    var url = urljoin(endpoint.rootUrl, options.url);
    var data = options.data;
    var method = options.method;

    if (_.isString(data)) {
        data = JSON.parse(data);
    }

    data = _.extend({}, data);

    var fetchOptions = {
        method: method
    };

    if (method === 'GET') {
        url = stringifyGETParams(url, data);
    } else if (method === 'POST' || method === 'PUT') {
        fetchOptions.body = JSON.stringify(data);
    }

    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-smooch-sdk': 'web/' + endpoint.sdkVersion
    };

    if (endpoint.appToken) {
        headers['app-token'] = endpoint.appToken;
    }

    if (endpoint.jwt) {
        headers.Authorization = 'Bearer ' + endpoint.jwt;
    }

    fetchOptions.headers = headers;

    return new Promise(function(resolve, reject) {
        fetch(url, fetchOptions)
            .then(status)
            .then(json)
            .then(function(body) {
                if (typeof options.success === 'function') {
                    options.success(body);
                }
                resolve(body);
            })
            .catch(function(err) {
                if (typeof options.error === 'function') {
                    options.error(err);
                }
                reject(err);
            });

    });
};
