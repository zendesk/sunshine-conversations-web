'use strict';

/* global process:false */

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
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
        watch: {
            scripts: {
                files: ['src/*/*.js', '*.html', 'src/templates/*.tpl', 'src/stylesheets/*.less'],
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
                src: 'dist/supportkit.js',
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
                    'dist/style.min.css': 'dist/style.css'
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
                    'dist/supportkit.js': ['src/js/ui.js'],
                },
                options: {
                    transform: ['jstify', 'cssify']
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
        },

        release: {
            options: {
                npm: false,
                bump: false,
                commit: false,
                remote: 'https://github.com/radialpoint/SupportKitPrivate.git head:master --force',
                github: {
                    repo: 'radialpoint/SupportKitPrivate', //put your user/repo here
                    usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
                    passwordVar: 'GITHUB_PASSWORD', //ENVIRONMENT VARIABLE that contains Github password
                    releaseNotes: 'release_notes'
                }
            }
        },

        exec: {
            createRelease: {
                cmd: function() {
                    return [
                        'git checkout -b r/' + this.option('globalVersion')
                    ].join(' && ');
                }
            },
            cleanRelease: {
                cmd: function() {
                    return [
                        'git checkout f/versioning+bower+npm',
                        'git branch -D r/' + this.option('globalVersion'),
                        'git tag -d ' + this.option('globalVersion')
                    ].join(' && ');
                }
            },
            commitFiles: {
                cmd: function() {
                    return [
                        'git commit -am "Release v' + this.option('globalVersion') + '"'
                    ].join(' && ');
                }
            },
            push: {
                cmd: 'git push'
            }
        },

        gitinfo: {
            commands: {
                'status.porcelain': ['status', '--porcelain']
            }
        }
    });

    grunt.registerTask('checkBranchStatus', 'A task that ensures the correct branch is checked out and there are no working changes.', function() {
        var gitInfo = grunt.config.get('gitinfo');

        if (gitInfo.status.porcelain /*|| gitInfo.local.branch.current.name !== 'master'*/ ) {
            grunt.log.error('Error. Please make sure you have master checked out and there are no working changes.');
            grunt.log.error('Git Status:', '\n' + gitInfo.status.porcelain);
            grunt.log.error('Git Branch: ', '\n ' + gitInfo.local.branch.current.name);
            return false;
        }

        if (!process.env.GITHUB_USERNAME || !process.env.GITHUB_PASSWORD) {
            grunt.log.error('Please set your github username and password as env variables (GITHUB_USERNAME, GITHUB_PASSWORD)');
            return false;
        }
    });

    grunt.registerTask('versionBump', function() {
        var semver = require('semver'),
            VERSION_REGEXP = /(\bversion[\'\"]?\s*[:=]\s*[\'\"])([\da-z\.-]+)([\'\"])/i,
            files = ['package.json', 'bower.json', 'src/js/main.js'],
            fullVersion = grunt.option('version'),
            versionType = grunt.option('versionType'),
            globalVersion;

        files.forEach(function(file, idx) {
            var version = null;
            var content = grunt.file.read(file).replace(VERSION_REGEXP, function(match, prefix, parsedVersion, suffix) {
                version = fullVersion || semver.inc(parsedVersion, versionType);
                return prefix + version + suffix;
            });

            if (!globalVersion) {
                globalVersion = version;
            } else if (globalVersion !== version) {
                grunt.warn('Bumping multiple files with different versions!');
            }

            grunt.file.write(file, content);
            grunt.log.ok('Version bumped to ' + version + (files.length > 1 ? ' (in ' + file + ')' : ''));
        });

        grunt.option('globalVersion', globalVersion);

        try {
            grunt.file.read('release_notes/v' + globalVersion + '.md');
        }
        catch (err) {
            grunt.log.error('Release notes not found.');
            grunt.log.error('Please ensure release notes exist in the release_notes folder. (v' + globalVersion + '.md)');
            return false;
        }
    });

    grunt.registerTask('publish', 'Publishes a build to github and NPM, accepting a version as argument', function(version) {
        if (!version || ['major', 'minor', 'patch'].indexOf(version) > -1) {
            grunt.option('versionType', version || 'patch');
        } else {
            grunt.option('version', version);
        }

        grunt.task.run('branchCheck', 'publish:prepare', 'publish:release', 'publish:cleanup');
    });

    grunt.registerTask('build', ['clean', 'less', 'cssmin', 'browserify', 'replace', 'uglify']);
    grunt.registerTask('devbuild', ['clean', 'less', 'cssmin', 'browserify']);

    grunt.registerTask('deploy', ['build', 'awsconfig', 's3', 'cloudfront:prod']);

    grunt.registerTask('run', ['runlog', 'concurrent:all']);
    grunt.registerTask('test', ['karma']);
    grunt.registerTask('default', ['run']);

    grunt.registerTask('publish:prepare', ['versionBump', 'build', 'exec:commitFiles', 'exec:createRelease']);
    grunt.registerTask('publish:release', ['release']);
    grunt.registerTask('publish:cleanup', ['exec:cleanRelease' /*, 'exec:push'*/ ]);

    grunt.registerTask('branchCheck', 'Checks that you are publishing from Master branch with no working changes', ['gitinfo', 'checkBranchStatus']);
};
