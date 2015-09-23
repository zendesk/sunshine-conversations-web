// Karma configuration
// Generated on Fri Nov 07 2014 08:13:06 GMT-0500 (EST)

module.exports = function(config) {
    var testReportsPath = process.env.CIRCLE_TEST_REPORTS || '.';

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'browserify', 'sinon-chai', 'phantomjs-shim', 'source-map-support'],

        // list of files / patterns to load in the browser
        files: ['test/bootstrap.js', './src/js/bootstrap.js', 'test/specs/**/*.spec.js'],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/bootstrap.js': ['browserify'],
            './src/js/bootstrap.js': ['browserify'],
            'test/specs/*.spec.js': ['browserify']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'junit'],

        // the default configuration
        junitReporter: {
            outputFile: testReportsPath + '/junit/test-results.xml',
            suite: ''
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        browserify: {
            debug: true // include inline source maps
        }
    });
};
