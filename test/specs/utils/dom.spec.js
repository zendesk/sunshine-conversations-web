import { monitorUrlChanges, __Rewire__ as DomRewire } from '../../../src/frame/js/utils/dom';

describe('monitorUrlChanges', () => {
    beforeEach(() => {
        DomRewire('parent', window);
    });

    it('should monitor hash changes and call callback', (done) => {
        monitorUrlChanges(() => {
            done();
        });

        window.location.hash = 'blorp';
    });

    it('should monitor push state changes and call callback', (done) => {
        monitorUrlChanges(() => {
            done();
        });

        history.pushState({
            blap: true
        }, 'blap', 'testerino');
    });

    it('should monitor replace state changes and call callback', (done) => {
        monitorUrlChanges(() => {
            done();
        });

        history.replaceState({
            blap: true
        }, 'blap', 'testerino');
    });
});
