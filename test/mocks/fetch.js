export function mock(sinon, status = 200, json = {}, statusText = '', headers = {
        'Content-Type': 'application/json'
    }) {
    return sinon.stub(global, 'fetch').callsFake(() => {
        return Promise.resolve({
            status: status,
            json: () => json,
            statusText: statusText,
            headers: {
                get: (header) => {
                    return headers[header];
                }
            }
        });
    });
}
