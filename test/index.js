import './bootstrap';
import { getReactWarningErrorArray, watchConsole, unwatchConsole } from './utils/react';

var context = require.context('.', true, /\.spec\.jsx?$/);
context.keys().forEach(context);

beforeEach(() => {
    watchConsole();
});

afterEach(() => {
    if(getReactWarningErrorArray().length > 0) {
        'Check your console for PropTypes warnings and errors'.should.eq('');
    }

    unwatchConsole();
});


module.exports = context;
