import { monitorUrlChanges } from '../../../src/frame/js/utils/dom';

describe('monitorUrlChanges', () => {
    it('should monitor hash changes and call callback', (done) => {
        monitorUrlChanges(() => {
            done();
        });

        parent.location.hash = 'blorp';
    });

    it('should monitor push state changes and call callback', (done) => {
        monitorUrlChanges(() => {
            done();
        });

        parent.history.pushState({
            blap: true
        }, 'blap', 'testerino');
    });

    it('should monitor replace state changes and call callback', (done) => {
        monitorUrlChanges(() => {
            done();
        });

        parent.history.replaceState({
            blap: true
        }, 'blap', 'testerino');
    });
});
