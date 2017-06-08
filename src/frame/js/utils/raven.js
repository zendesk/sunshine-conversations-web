import Raven from 'raven-js';

if (SENTRY_DSN) {
    Raven.config(SENTRY_DSN, {
        release: VERSION
    }).install();

    window.onunhandledrejection = function(e) {
        Raven.captureException(e.reason);
    };
}
