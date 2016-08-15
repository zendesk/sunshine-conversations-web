import './bootstrap';
import { getConsoleWarningErrorArray, watchConsole, unwatchConsole } from './utils/console';

var context = require.context('.', true, /\.spec\.jsx?$/);
context.keys().forEach(context);

beforeEach(() => {
    watchConsole();
});

afterEach(() => {
    if (getConsoleWarningErrorArray().length > 0) {
        `Check your console for warnings and errors : ${getConsoleWarningErrorArray().join(', ')}`.should.eq('');
    }

    unwatchConsole();
});


module.exports = context;
