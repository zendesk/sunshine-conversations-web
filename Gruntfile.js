'use strict';

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('runlog', function() {
        grunt.log.write('http://localhost:8282/example/dev.html');
    });

    grunt.registerTask('awsconfig', function() {
        grunt.config.set('aws', grunt.file.readJSON('grunt-aws.json'))
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
                configFile: 'karma.conf.js',
                singleRun: false,
                browsers: ['PhantomJS', 'Chrome'],
                reporters: ['progress']
            },
            ci: {
                configFile: 'karma.conf.js',
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
                src: ['dist/supportkit.js'],
                dest: 'dist/supportkit.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/js/**/*.js', '*.html', 'src/templates/*.tpl', 'src/stylesheets/*.less'],
                tasks: ['devbuild'],
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
        replace: {
            dist: {
                src: 'dist/supportkit.js',
                dest: 'dist/supportkit.js',
                replacements: [{
                    from: /var ROOT_URL = '.*';/,
                    to: 'var ROOT_URL = "https://sdk.supportkit.io";'
                }]
            }
        },
        'http-server': {
            'dev': {
                root: '.',
                port: 8282,
                host: '127.0.0.1',
                showDir: true,
                autoIndex: true,
                ext: 'html',
                runInBackground: false
            }
        },
        browserify: {
            dist: {
                files: {
                    'dist/supportkit.js': ['src/js/main.js'],
                }
            },
            options: {
                browserifyOptions: {
                    debug: true,
                    'transform': [
                        'browserify-shim'
                    ]
                }
            }
        },
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
        },
        concurrent: {
            all: ['http-server', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        cloudfront: {
            options: {
                region: 'us-east-1', // your AWS region
                distributionId: 'E1RI234SLR5ORA', // DistributionID where files are stored
                credentials: {
                    accessKeyId: '<%= aws.key %>',
                    secretAccessKey: '<%= aws.secret %>'
                },
                listInvalidations: true, // if you want to see the status of invalidations
                listDistributions: false, // if you want to see your distributions list in the console
                version: '1.0' // if you want to invalidate a specific version (file-1.0.js)
            },
            prod: {
                options: {
                    distributionId: 'E1RI234SLR5ORA'
                },
                CallerReference: Date.now().toString(),
                Paths: {
                    Quantity: 1,
                    Items: ['/supportkit.min.js']
                }
            }
        }
    });



    grunt.registerTask('build', ['clean', 'browserify', 'replace', 'concat', 'uglify']);
    grunt.registerTask('devbuild', ['clean', 'browserify', 'concat']);
    grunt.registerTask('deploy', ['build', 'awsconfig', 's3', 'cloudfront:prod']);
    grunt.registerTask('run', ['runlog', 'devbuild', 'concurrent:all']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:ci', ['karma:ci']);
    grunt.registerTask('default', ['run']);
};
