import _ from 'underscore';
import sinon from 'sinon';

const sandbox = sinon.sandbox.create();

export function watchConsole() {
    sandbox.spy(console, 'error');
    sandbox.spy(console, 'warn');
}

export function getConsoleWarningErrorArray() {
    const errors = _.times(console.error.callCount, (index) => console.error.getCall(index));
    const warnings = _.times(console.warn.callCount, (index) => console.warn.getCall(index));

    return errors.concat(warnings)
        .filter((c) => (c.args && c.args.length && /(Invalid|Failed|Unhandled)/gi.test(c.args[0])))
        .map((c) => c.args.join('|'));
}

export function unwatchConsole() {
    sandbox.restore();
}
