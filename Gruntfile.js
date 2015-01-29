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
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= banner %>'
            },
            dist: {
                src: ['src/*.js'],
                dest: 'dist/supportkit.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/supportkit.min.js'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['build'],
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
        }
    });

    grunt.registerTask('build', ['clean', 'concat', 'uglify']);
    grunt.registerTask('run', ['runlog', 'http-server', 'watch']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['build']);
};