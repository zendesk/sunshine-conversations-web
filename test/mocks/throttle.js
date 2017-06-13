export function createMock(sinon) {
    return class ThrottleMock {
        constructor() {
            this.exec = sinon.spy(this.exec);
        }

        exec(fn) {
            return fn();
        }
    };
}
