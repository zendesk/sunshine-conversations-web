import sinon from 'sinon';

import { Throttle } from '../../../src/js/utils/throttle';

describe('Throttle', () => {
    let throttledFunc;
    let counter;

    beforeEach(() => {
        counter = 0;
        const waitTimeMs = 1;
        const throttle = new Throttle(waitTimeMs);

        throttledFunc = () => throttle.exec(() => {
            return new Promise((resolve) => {
                counter++;
                setTimeout(() => resolve(counter), 1);
            });
        });
    });

    it('should resolve with wrapped promise', () => {
        throttledFunc().then((result) => {
            result.should.eql(1);
        });
    });

    it('should return original promise when throttled', () => {
        const firstCall = throttledFunc()
        const secondCall = throttledFunc();

        return Promise.all([firstCall, secondCall])
            .then(([firstResult, secondResult]) => {
                firstResult.should.eql(1);
                secondResult.should.eql(1);
            });
    });

    it('should make a fresh call after the throttle expires', () => {
        throttledFunc()

        let secondCall;
        const waitTwoMs = new Promise((resolve) => {
            setTimeout(() => {
                 secondCall = throttledFunc();
                resolve();
            }, 2);
        });

        return waitTwoMs
            .then(() => secondCall)
            .then((thirdResult) => {
                thirdResult.should.eql(2);
            });
    });
});
