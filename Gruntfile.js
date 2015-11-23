'use strict';

/* global process:false */

var _ = require('underscore');

module.exports = function(grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('awsconfig', function() {
        var awsConfig;
        try {
            awsConfig = grunt.file.readJSON('grunt-aws.json');
        }
        catch (e) {
            awsConfig = {};
        }

        awsConfig.key = (process.env.AWS_ACCESS_KEY_ID || awsConfig.key);
        awsConfig.secret = (process.env.AWS_SECRET_ACCESS_KEY || awsConfig.secret);
        awsConfig.bucket = (process.env.SK_JS_S3_BUCKET || awsConfig.bucket);

        grunt.config.set('aws', awsConfig);
    });

    grunt.registerTask('maxcdnconfig', function() {
        var maxCDN;
        try {
            maxCDN = grunt.file.readJSON('grunt-maxcdn.json');
        }
        catch (e) {
            maxCDN = {};
        }

        maxCDN.companyAlias = (process.env.MAXCDN_COMPANY_ALIAS || maxCDN.companyAlias);
        maxCDN.consumerKey = (process.env.MAXCDN_CONSUMER_KEY || maxCDN.consumerKey);
        maxCDN.consumerSecret = (process.env.MAXCDN_CONSUMER_SECRET || maxCDN.consumerSecret);
        maxCDN.zoneId = (process.env.MAXCDN_ZONE_ID || maxCDN.zoneId);

        grunt.config.set('maxcdn.options', maxCDN);
    });

    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        license: grunt.file.read('LICENSE'),
        globalVersion: '<%= pkg.version %>',
        banner: '/*! \n\t<%= pkg.name %> <%= globalVersion %> \n\t<%= license %> \n*/\n',
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

        s3: {
            options: {
                key: '<%= aws.key %>',
                secret: '<%= aws.secret %>',
                bucket: '<%= aws.bucket %>',
                access: 'public-read'
            },
            js: {
                // Files to be uploaded.
                upload: [{
                    src: 'dist/public/smooch.js',
                    dest: 'smooch.min.js'
                }]
            },
            images: {
                upload: [
                    {
                        src: 'src/images/**',
                        dest: 'images/',
                        options: {
                            gzip: true
                        }
                    }
                ]
            }
        },

        concurrent: {
            dev: ['exec:hotDevServer', 'exec:devServer'],
            options: {
                logConcurrentOutput: true
            }
        },

        maxcdn: {
            purgeCache: {
                options: {
                    companyAlias: '<%= maxcdn.options.companyAlias %>',
                    consumerKey: '<%= maxcdn.options.consumerKey %>',
                    consumerSecret: '<%= maxcdn.options.consumerSecret %>',
                    zone_id: '<%= maxcdn.options.zoneId %>',
                    method: 'delete'
                },
                files: [
                    {
                        dest: '/smooch.min.js'
                    }
                ]
            }
        },

        release: {
            options: {
                npm: true,
                bump: false,
                commit: true,
                push: false,
                remote: 'https://github.com/smooch/smooch-js.git',
                github: {
                    repo: 'smooch/smooch-js', //put your user/repo here
                    accessTokenVar: 'GITHUB_ACCESS_TOKEN',
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
                        'git commit -am "Release v' + this.option('globalVersion') + ' [ci skip]"'
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
                        'git add --force dist/smooch.js',
                        'git add --force dist/smooch.min.js'
                    ].join(' && ');
                }
            },
            clean: {
                cmd: 'rm -rf dist/'
            },
            build: {
                cmd: 'npm run build'
            },
            hotDevServer: {
                cmd: 'npm run hot-dev-server'
            },
            devServer: {
                cmd: 'npm run start-dev'
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

        if (!process.env.GITHUB_ACCESS_TOKEN) {
            grunt.log.error('Please set your github access token as env variables (GITHUB_ACCESS_TOKEN)');
            return false;
        }
    });

    grunt.registerTask('versionBump', function() {
        var semver = require('semver');
        var VERSION_REGEXP = /(\bversion[\'\"]?\s*[:=]\s*[\'\"])([\da-z\.-]+)([\'\"])/i;
        var files = ['package.json', 'bower.json', 'src/js/main.js'];
        var fullVersion = grunt.option('version');
        var versionType = grunt.option('versionType');
        var globalVersion;

        files.forEach(function(file) {
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
        grunt.config.set('globalVersion', globalVersion);

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

    grunt.registerTask('build', ['clean', 'exec:build']);
    grunt.registerTask('dev', ['build', 'concurrent:dev']);

    grunt.registerTask('deploy', ['build', 'awsconfig', 'maxcdnconfig', 's3:js', 'maxcdn']);
    grunt.registerTask('test', ['karma:unit']);
    grunt.registerTask('test:ci', ['karma:ci']);
    grunt.registerTask('default', ['dev']);

    grunt.registerTask('publish:prepare', ['versionBump', 'exec:commitFiles', 'exec:createRelease', 'build', 'exec:addDist']);
    grunt.registerTask('publish:release', ['release']);
    grunt.registerTask('publish:cleanup', ['exec:cleanRelease', 'exec:push']);

    grunt.registerTask('branchCheck', 'Checks that you are publishing from Master branch with no working changes', ['gitinfo', 'checkBranchStatus']);

    grunt.registerTask('cdnify', ['awsconfig', 's3:images']);
};
