'use strict';

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-contrib-less');

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
        concat: {
            options: {
                stripBanners: true,
                banner: '<%= banner %>'
            },
            dist: {
                src: ['dist/supportkit.js', 'dist/style.min.css.js'],
                dest: 'dist/supportkit.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/*/*.js', '*.html', "src/templates/*.tpl", "src/stylesheets/*.less"],
                tasks: ['build'],
                options: {
                    spawn: false,
                },
            },
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
        less: {
            dist: {
                files: {
                    'dist/style.css': 'src/stylesheets/main.less'
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    'dist/style.min.css': ['dist/style.css']
                }
            }
        },
        replace: {
            dist: {
                src: 'dist/supportkit.js',
                dest: 'dist/supportkit.js',
                replacements: [{
                    from: /var ROOT_URL = '.*';/,
                    to: 'var ROOT_URL = "https://app.supportkit.io";'
                }]
            }
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
        str2js: {
            SupportKit: {
                'dist/style.min.css.js': ['dist/style.min.css']
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/supportkit.js': ['src/js/ui.js'],
                },
                options: {
                    transform: ['jstify']
                }
            },
            options: {
                browserifyOptions: {
                    debug: true
                }
            }
        },

        aws: grunt.file.readJSON('grunt-aws.json'),
        s3: {
            options: {
                key: '<%= aws.key %>',
                secret: '<%= aws.secret %>',
                bucket: '<%= aws.bucket %>',
                access: 'public-read'
            },
            dev: {
                // Files to be uploaded. 
                upload: [{
                    src: 'dist/supportkit.min.js',
                    dest: 'supportkit.min.js'
                }]
            }
        }
    });

    grunt.registerTask('build', ['clean', 'browserify', 'replace', 'less', 'cssmin', 'str2js', 'concat', 'uglify']);
    grunt.registerTask('deploy', ['build', 's3']);
    grunt.registerTask('run', ['runlog', 'http-server', 'watch']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['browserify']);
};