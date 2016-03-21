import { monitorUrlChanges, stopMonitoringUrlChanges } from 'utils/dom';

describe('monitorUrlChanges', () => {
    it('should monitor hash changes and call callback', (done) => {
        stopMonitoringUrlChanges();

        monitorUrlChanges(() => {
            done();
        });

        window.location.hash = 'blorp';
    });

    it('should monitor push state changes and call callback', (done) => {
        stopMonitoringUrlChanges();

        monitorUrlChanges(() => {
            done();
        });

        history.pushState({
            blap: true
        }, 'blap', 'testerino');
    });

    it('should monitor replace state changes and call callback', (done) => {
        stopMonitoringUrlChanges();

        monitorUrlChanges(() => {
            done();
        });

        history.replaceState({
            blap: true
        }, 'blap', 'testerino');
    });
});
