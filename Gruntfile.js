'use strict';

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('runlog', function() {
        grunt.log.write('http://localhost:8282/example/example1.html');
    });

    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n',
        // Task configuration
        clean: ['dist/*'],
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js', '*.html'],
                tasks: ['browserify'],
                options: {
                    spawn: false,
                },
            },
        },
        'http-server': {
            'dev': {
                root: '.',
                port: 8282,
                host: "127.0.0.1",
                showDir: true,
                autoIndex: true,
                ext: "html",
                runInBackground: true
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/supportkit.js': ['src/main.js'],
                }
            }
        }
    });

    grunt.registerTask('build', ['clean', 'concat', 'uglify']);
    grunt.registerTask('run', ['runlog', 'http-server', 'watch']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['build']);
};