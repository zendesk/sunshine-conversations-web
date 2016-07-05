import _ from 'underscore';
import sinon from 'sinon';

export function watchConsole() {
    sinon.spy(console, 'error'); // ensure that we don't swallow up console error output

    sinon.spy(console, 'warn'); // ensure that we don't swallow up console warn output
}

export function getConsoleWarningErrorArray() {
    const errors = _.times(console.error.callCount, (index) => console.error.getCall(index));
    const warnings = _.times(console.warn.callCount, (index) => console.warn.getCall(index));

    return errors.concat(warnings)
        .filter((c) => (c.args && c.args.length && /(Invalid|Failed|Unhandled)/gi.test(c.args[0])))
        .map((c) => c.args.join('|'));
}

export function unwatchConsole() {
    if (console.error.restore) {
        console.error.restore();
    }

    if (console.warn.restore) {
        console.warn.restore();
    }
}
