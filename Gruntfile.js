'use strict';

/* global process:false */

var _ = require('underscore');

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('runlog', function() {
        grunt.log.write('http://localhost:8282/example/demo.html');
    });

    grunt.registerTask('awsconfig', function() {
        grunt.config.set('aws', grunt.file.readJSON('grunt-aws.json'));
    });

    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        license: grunt.file.read('LICENSE'),
        banner: '/*! \n\t<%= pkg.name %> <%= pkg.version %> \n\t<%= license %> \n*/\n',
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
        watch: {
            scripts: {
                files: ['src/js/**/*.js', '*.html', 'src/templates/*.tpl', 'src/stylesheets/*.less', 'config/config.json'],
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
        replace: {
            dist: {
                src: 'dist/supportkit.js',
                dest: 'dist/supportkit.js',
                replacements: [{
                    from: /var ROOT_URL = '.*';/,
                    to: 'var ROOT_URL = "<%= config.ROOT_URL %>";'
                }]
            },
            demo: {
                src: 'example/template/demo.html',
                dest: 'example/demo.html',
                replacements: [{
                    from: /APP_TOKEN/,
                    to: '<%= config.APP_TOKEN %>'
                }, {
                    from: /GIVEN_NAME/,
                    to: '<%= config.GIVEN_NAME %>'
                }, {
                    from: /SURNAME/,
                    to: '<%= config.SURNAME %>'
                }, {
                    from: /EMAIL/,
                    to: '<%= config.EMAIL %>'
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
                    ],
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
                commit: true,
                push: false,
                remote: 'https://github.com/supportkit/supportkit-js.git',
                github: {
                    repo: 'supportkit/supportkit-js', //put your user/repo here
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
                        'git checkout master',
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
                cmd: function() {
                    return [
                        'git push origin master',
                        'git checkout integration',
                        'git merge master --no-ff',
                        'git push origin integration'
                    ].join(' && ');
                }
            },
            addDist: {
                cmd: function() {
                    return [
                        'git add --force dist/supportkit.js',
                        'git add --force dist/supportkit.min.js'
                    ].join(' && ');
                }
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

        if (gitInfo.status.porcelain || gitInfo.local.branch.current.name !== 'master') {
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

    grunt.registerTask('loadConfig', 'Loads config from config folder (uses default if none present', function() {
        var defaultConfig = grunt.file.readJSON('config/default/config.json');
        var config = {};

        try {
            config = grunt.file.readJSON('config/config.json');
        }
        catch (err) {
            grunt.log.warn('You might want to create a config with your app token at config/config.json');
        }

        var merged = _.extend(defaultConfig, config);
        grunt.config.set('config', merged);
    });

    grunt.registerTask('build', ['clean', 'browserify', 'uglify']);
    grunt.registerTask('devbuild', ['clean', 'browserify', 'loadConfig', 'replace']);
    grunt.registerTask('deploy', ['build', 'awsconfig', 's3', 'cloudfront:prod']);
    grunt.registerTask('run', ['runlog', 'devbuild', 'concurrent:all']);
    grunt.registerTask('test:unit', ['karma:unit']);
    grunt.registerTask('test:ci', ['karma:ci']);
    grunt.registerTask('default', ['run']);

    grunt.registerTask('publish:prepare', ['versionBump', 'exec:commitFiles', 'exec:createRelease', 'build', 'exec:addDist']);
    grunt.registerTask('publish:release', ['release']);
    grunt.registerTask('publish:cleanup', ['exec:cleanRelease', 'exec:push']);

    grunt.registerTask('branchCheck', 'Checks that you are publishing from Master branch with no working changes', ['gitinfo', 'checkBranchStatus']);

};
