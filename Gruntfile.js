'use strict';

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-cloudfront');
    grunt.registerTask('runlog', function() {
        grunt.log.write('http://localhost:8282/example/dev.html');
    });

    grunt.registerTask('awsconfig', function() {
        grunt.config.set('aws', grunt.file.readJSON('grunt-aws.json'));
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
                    to: 'var ROOT_URL = "https://sdk.supportkit.io";'
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
                runInBackground: false
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
                    debug: true,
                    standalone: 'SupportKit'
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
                distributionId: "E1RI234SLR5ORA", // DistributionID where files are stored 
                credentials: {
                    accessKeyId: "<%= aws.key %>",
                    secretAccessKey: '<%= aws.secret %>'
                },
                listInvalidations: true, // if you want to see the status of invalidations 
                listDistributions: false, // if you want to see your distributions list in the console 
                version: "1.0" // if you want to invalidate a specific version (file-1.0.js) 
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
        },

        push: {
            options: {
                files: ['package.json', 'bower.json', 'src/js/main.js'],
                updateConfigs: [],
                add: true,
                addFiles: ['.'], // '.' for all files except ingored files in .gitignore
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'https://github.com/radialpoint/SupportKitPrivate.git release-orphan:master --force',
                npm: false,
                npmTag: 'Release v%VERSION%',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },

        exec: {
            createOrphan: {
                cmd: function() {
                    return [
                        'git checkout --orphan release-orphan',
                        'git rm -r --cached .',
                        'cp public.gitignore .gitignore'
                    ].join(' && ');
                }
            },
            cleanOrphan: {
                cmd: function() {
                    return [
                        'git checkout f/versioning+bower+npm',
                        // 'git tag -d v1.0.1',
                        'git branch -D release-orphan'
                    ].join(' && ');
                }
            }
        },

        gitinfo: {
            commands: {
                'status.porcelain': ['status', '--porcelain']
            }
        },
    });

    grunt.registerTask('branchCheck', 'A task that ensures the correct branch is checked out and there are no working changes.', function() {
        var gitInfo = grunt.config.get('gitinfo');

        if (gitInfo.status.porcelain /*|| gitInfo.local.branch.current.name !== 'master'*/ ) {
            grunt.log.error('Error. Please make sure you have master checked out and there are no working changes.');
            grunt.log.error('Git Status:', '\n' + gitInfo.status.porcelain);
            grunt.log.error('Git Branch: ', '\n ' + gitInfo.local.branch.current.name);
            return false;
        }
    });

    grunt.registerTask('build', ['clean', 'browserify', 'replace', 'less', 'cssmin', 'str2js', 'concat', 'uglify']);
    grunt.registerTask('devbuild', ['clean', 'browserify', 'less', 'cssmin', 'str2js', 'concat']);

    grunt.registerTask('deploy', ['build', 'awsconfig', 's3', 'cloudfront:prod']);

    grunt.registerTask('run', ['runlog', 'concurrent:all']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['run']);

    grunt.registerTask('publish', ['gitinfo', 'branchCheck', 'publish:prepare', 'push-only', 'build', 'push-commit', 'publish:cleanup']);
    grunt.registerTask('publish:prepare', ['exec:createOrphan']);
    grunt.registerTask('publish:cleanup', ['exec:cleanOrphan']);
};