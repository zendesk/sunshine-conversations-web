import sinon from 'sinon';
import hat from 'hat';

import { mock as mockFetch } from '../../mocks/fetch';
import { createMockedStore, generateBaseStoreProps } from '../../utils/redux';
import http, { stringifyGETParams, handleResponse } from '../../../src/frame/js/actions/http';

const USER_ID = '1';
const JWT = 'some-jwt';
const SESSION_TOKEN = 'session-token';

function getMockedHeaders(headers = {}) {
    return {
        get: (header) => {
            return headers[header];
        }
    };
}

function generateExpectation(method, url, data, headers, useJwt, useSessionToken) {
    method = method.toUpperCase();

    const options = {
        method: method,
        headers: Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-smooch-sdk': `web/${VENDOR_ID}/${VERSION}`
        }, headers)
    };

    if (useJwt) {
        options.headers.Authorization = `Bearer ${JWT}`;
    } else if (useSessionToken) {
        options.headers.Authorization = `Basic ${btoa(`${USER_ID}:${SESSION_TOKEN}`)}`;
    }

    if (data) {
        data = Object.assign({}, data);

        if (method === 'GET') {
            url = stringifyGETParams(url, data);
        } else if (method === 'POST' || method === 'PUT') {
            options.body = JSON.stringify(data);
        }
    }

    return {
        url: url,
        options: options
    };
}

function generateTestName(method, data, headers, useJwt, useSessionToken) {
    const dataPart = data && Object.keys(data).length > 0 ? 'with data' : 'without data';
    const headersPart = headers && Object.keys(headers).length > 0 ? 'with headers' : 'without headers';
    const jwtPart = useJwt ? 'with jwt' : 'without jwt';
    const sessionTokenPart = useSessionToken ? 'with sessionToken' : 'without sessionToken';

    return `${method} ${dataPart}, ${headersPart}, ${jwtPart}, ${sessionTokenPart}`;
}

describe('HTTP', () => {
    const sandbox = sinon.sandbox.create();
    let fetchStub;
    let mockedStore;

    beforeEach(() => {
        fetchStub = mockFetch(sandbox);
    });

    afterEach(() => {
        sandbox.restore();
    });

    [true, false].forEach((useJwt) => {
        [true, false].forEach((useSessionToken) => {
            describe('fetch', () => {
                [
                    {
                        url: '/some-endpoint',
                        method: 'get'
                    },
                    {
                        url: '/some-endpoint',
                        method: 'GET'
                    },
                    {
                        url: '/some-endpoint',
                        method: 'post',
                        data: {
                            some: 'data'
                        }
                    },
                    {
                        url: '/some-endpoint',
                        method: 'POST',
                        data: {
                            some: 'data'
                        }
                    },
                    {
                        url: '/some-endpoint',
                        method: 'DELETE',
                        data: {
                            some: 'data'
                        }
                    },
                    {
                        url: '/some-endpoint',
                        method: 'POST',
                        data: {
                            some: 'data'
                        },
                        headers: {
                            header: 'yes'
                        }
                    },
                    {
                        url: '/some-endpoint',
                        method: 'PUT',
                        headers: {
                            header: 'yes'
                        }
                    }
                ].forEach((options) => {
                    describe(generateTestName(options.method, options.data, options.headers, useJwt, useSessionToken), () => {
                        beforeEach(() => {
                            mockedStore = createMockedStore(sandbox, generateBaseStoreProps({
                                auth: {
                                    jwt: useJwt ? JWT : null,
                                    sessionToken: useSessionToken ? SESSION_TOKEN : null
                                },
                                user: {
                                    _id: USER_ID,
                                    clients: [],
                                    pendingClients: []
                                }
                            }));
                        });

                        it('should transform the options correctly', () => {
                            const {config: {apiBaseUrl}} = mockedStore.getState();

                            const expection = generateExpectation(options.method, `${apiBaseUrl}${options.url}`, options.data, options.headers, useJwt, useSessionToken);

                            return mockedStore.dispatch(http(options.method, options.url, options.data, options.headers)).then(() => {
                                fetchStub.should.have.been.calledWithMatch(expection.url, expection.options);
                            });
                        });
                    });
                });
            });
        });

        describe('#handleResponse', () => {
            let response;

            beforeEach(function() {
                response = {
                    status: 200,
                    statusText: hat(),
                    headers: getMockedHeaders()
                };
            });

            [202, 204].forEach((status) => {
                it('should not return a body if HTTP ' + status, () => {
                    response.status = status;

                    return handleResponse(response).then((body) => {
                        expect(body).to.be.undefined;
                    });
                });
            });

            [200, 201, 203, 299].forEach((status) => {
                it('should return the value of json() if HTTP ' + status, () => {
                    const jsonData = {
                        val1: hat()
                    };

                    response.status = status;
                    response.json = sandbox.stub().resolves(jsonData);
                    response.headers = getMockedHeaders({
                        'Content-Type': 'application/json'
                    });

                    return handleResponse(response).then((body) => {
                        response.json.should.have.been.calledOnce;
                        body.should.equals(jsonData);
                    });
                });
            });

            it('should not return a body if content type is not application/json', () => {
                response.json = sandbox.stub();

                return handleResponse(response).then((body) => {
                    response.json.should.not.have.been.called;
                    expect(body).to.be.undefined;
                });
            });

            [300, 301, 302, 303, 304, 401, 402, 403, 404, 429, 500, 503, 599].forEach((status) => {
                it('should throw an error with HTTP ' + status, () => {
                    response.status = status;

                    const promise = handleResponse(response);

                    promise.should.be.rejected;
                    return promise.catch((e) => {
                        e.message.should.equal(response.statusText);
                        e.response.should.equal(response);
                    });
                });

                it('should parse the json error with HTTP ' + status, () => {
                    const jsonData = {
                        error: {
                            code: hat(),
                            description: hat()
                        }
                    };

                    response.status = status;
                    response.json = sandbox.stub().resolves(jsonData);
                    response.headers = getMockedHeaders({
                        'Content-Type': 'application/json'
                    });

                    const promise = handleResponse(response);

                    promise.should.be.rejected;
                    return promise.catch((e) => {
                        e.message.should.equal(jsonData.error.description);
                        e.description.should.equal(jsonData.error.description);
                        e.code.should.equal(jsonData.error.code);
                        e.response.should.equal(response);
                    });
                });
            });
        });
    });

});
