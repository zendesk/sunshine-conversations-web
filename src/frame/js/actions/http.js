import urljoin from 'urljoin';

/**
 * Stringifies query parameters and append them to the url
 * @param  {string} url  - an url
 * @param  {object} data - an object containing the query parameters
 * @return {string}      - the final url
 */
export function stringifyGETParams(url, data) {
    const query = Object.keys(data).reduce((q, key) => {
        if (data[key] !== null) {
            return q + '&' + encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }
        return q;
    }, '');

    if (query) {
        url += (~url.indexOf('?') ? '&' : '?') + query.substring(1);
    }
    return url;
}

export function handleResponse(response) {
    if (response.status === 202 || response.status === 204) {
        return Promise.resolve();
    }

    const contentType = response.headers.get('Content-Type') || '';
    const isJson = contentType.indexOf('application/json') > -1;

    if (response.status >= 200 && response.status < 300) {
        return isJson ? response.json() : Promise.resolve();
    } else {
        if (isJson) {
            return response.json().then(function(json) {
                const {error={}} = json;

                const err = new Error(error.description || response.statusText);
                err.response = response;
                err.code = error.code;
                err.description = error.description;

                throw err;
            });
        } else {
            const error = new Error(response.statusText);
            error.response = response;

            return Promise.reject(error);
        }
    }
}

export default function http(method, url, data, extraHeaders = {}, baseUrl) {
    return (dispatch, getState) => {
        method = method.toUpperCase();
        const {auth, config} = getState();

        const headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-smooch-sdk': `web/${VERSION}`,
            ...extraHeaders
        };

        if (auth.jwt) {
            headers.Authorization = `Bearer ${auth.jwt}`;
        } else if (auth.sessionToken) {
            headers.Authorization = `Basic ${btoa(`${auth.userId}:${auth.sessionToken}`)}`;
        }

        const fetchOptions = {
            method: method,
            headers
        };

        if (data) {
            if (data instanceof FormData) {
                fetchOptions.body = data;
                // Remove the Content-Type header, `fetch` will
                // generate one to add the form boundary.
                delete fetchOptions.headers['Content-Type'];
            } else {
                data = Object.assign({}, data);
                if (method === 'GET') {
                    url = stringifyGETParams(url, data);
                } else if (method === 'POST' || method === 'PUT') {
                    fetchOptions.body = JSON.stringify(data);
                }
            }
        }

        const fullUrl = urljoin(baseUrl || config.apiBaseUrl, url);
        return fetch(fullUrl, fetchOptions)
            .then(handleResponse);
    };
}
