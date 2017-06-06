const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const StatsPlugin = require('stats-webpack-plugin');
const rulesByExtension = require('./webpack/lib/rulesByExtension');

// Possible options:
// buildType : possible values ['npm', 'host', 'frame', 'dev', 'test']
//  - npm : build in prevision of the npm release
//  - host : build the host lib only
//  - frame : build the frame lib only
//  - dev : build both the frame and the host for the dev server
//  - test : build for tests
// publicPath: a way to override the public path (in case of testing on a test CDN)
// debug : should webpack be in debug mode or not
// minimize : should the output be minified
// devtool : webpack devtool options override (sourcemap config)
// generateStats : should webpack generate a stats.json file for debugging

module.exports = function(options) {
    const VERSION = require('./package.json').version;
    const PACKAGE_NAME = require('./package.json').name;
    const LICENSE = fs.readFileSync('LICENSE', 'utf8');
    const config = require('./config/default/config.json');
    const {buildType} = options;

    try {
        Object.assign(config, require('./config/config.json'));
    }
    catch (e) {
        // do nothing
    }

    let entry;

    if (buildType === 'npm') {
        entry = {
            index: './src/host/js/umd'
        };
    } else if (buildType === 'host') {
        entry = {
            smooch: './src/host/js/umd'
        };
    } else if (buildType === 'frame') {
        entry = {
            frame: './src/frame/js/index'
        };
    } else if (buildType === 'dev' || buildType === 'test') {
        entry = {
            smooch: './src/host/js/umd',
            frame: './src/frame/js/index'
        };
    } else {
        throw new Error('Unknown build type');
    }

    const rules = {
        'png|jpg|jpeg|gif|svg': {
            loader: 'url-loader',
            options: {
                limit: 100000
            }
        },
        'mp3': {
            loader: 'url-loader',
            options: {
                limit: 100000
            }
        }
    };

    const hostJsRule = {
        test: /\.jsx?(\?.*)?$/,
        include: [
            path.resolve(__dirname, 'src/host/'),
            path.resolve(__dirname, 'src/shared/')
        ],
        use: [
            {
                loader: 'babel-loader',
                options: {
                    forceEnv: 'host'
                }
            }
        ]
    };

    const frameJsRule = {
        test: /\.jsx?(\?.*)?$/,
        include: [
            path.resolve(__dirname, 'src/frame/'),
            path.resolve(__dirname, 'src/shared/')
        ],
        use: [
            {
                loader: 'babel-loader',
                options: {
                    forceEnv: 'frame'
                }
            }
        ]
    };

    const hostStyleRule = {
        test: /\.less(\?.*)?$/,
        include: [
            path.resolve(__dirname, 'src/host/'),
            path.resolve(__dirname, 'src/shared/')
        ],
        use: [
            {
                loader: 'style-loader/useable',
                options: {
                    insertAt: 'bottom'
                }
            },
            {
                loader: 'css-loader',
                options: {
                    modules: true
                }
            },
            'less-loader',
        ]
    };

    const frameStyleRule = {
        test: /\.less(\?.*)?$/,
        include: [
            path.resolve(__dirname, 'src/frame/'),
            path.resolve(__dirname, 'src/shared/')
        ],
        use: [
            'style-loader',
            'css-loader',
            'less-loader'
        ]
    };

    const publicPath = options.publicPath ?
        options.publicPath :
        buildType === 'dev' ?
            '/_assets/' :
            'https://cdn.smooch.io/';

    // Only need to append the version if we're building the host lib or the frame lib
    // in prevision of a release.
    const baseFilename = ['host', 'frame'].includes(buildType) ?
        `[name].${VERSION}` :
        '[name]';

    // Only use .min.js if we ask for minification
    const fileExtension = options.minimize ?
        '.min.js' :
        '.js';

    const output = {
        path: options.outputPath || path.join(__dirname, buildType === 'npm' ? 'lib' : 'dist'),
        publicPath,
        filename: baseFilename + fileExtension,
        chunkFilename: buildType === 'dev' ? '[id].js' : '[name].js',
        sourceMapFilename: '[file].map',
        library: buildType === 'host' ? 'Smooch' : undefined,
        libraryTarget: buildType === 'npm' ? 'commonjs2' : 'var',
        pathinfo: options.debug
    };

    const excludeFromStats = [
        /node_modules[\\\/]/
    ];


    // The following variable are about how the frame lib will be referenced in the iframe html.
    // see `FRAME_LIB_URL` in `src/host/js/smooch.js`.
    // In host and npm mode, it's referencing a file that should already (or soon to) be on the CDN
    // so it should target the full name + version.
    // In other cases, iframe.js will do just fine.
    let frameLibFilename;

    if (['host', 'npm'].includes(buildType)) {
        // in this case, it's referencing an already built frame lib
        // and it's mostly likely minified already.
        frameLibFilename = `frame.${VERSION}.min.js`;
    } else {
        frameLibFilename = 'frame.js';
    }

    const plugins = [
        new webpack.DefinePlugin({
            FRAME_LIB_URL: `'${publicPath}${frameLibFilename}'`
        })
    ];

    if (options.generateStats) {
        plugins.push(new StatsPlugin('stats.json', {
            chunkModules: true,
            exclude: excludeFromStats
        }));
    }

    if (options.minimize) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compressor: {
                    warnings: false
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.NoEmitOnErrorsPlugin(),

            new webpack.BannerPlugin({
                banner: PACKAGE_NAME + ' ' + VERSION + ' \n' + LICENSE,
                entryOnly: true
            })
        );
    } else if (options.npmRelease) {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            }),
            new webpack.NoEmitOnErrorsPlugin(),

            new webpack.BannerPlugin({
                banner: PACKAGE_NAME + ' ' + VERSION + ' \n' + LICENSE,
                entryOnly: true
            })
        );
    } else if (options.test) {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('test')
                }
            })
        );
    } else {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('development')
                }
            })
        );
    }

    if (options.debug) {
        plugins.push(new webpack.LoaderOptionsPlugin({
            debug: true
        }));
    }

    return {
        entry: entry,
        output: output,
        target: 'web',
        module: {
            rules: rulesByExtension(rules)
                .concat([
                    hostStyleRule,
                    frameStyleRule,
                    hostJsRule,
                    frameJsRule
                ])
        },
        devtool: options.devtool,
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [
                'node_modules'
            ]
        },
        plugins: plugins,
        devServer: {
            stats: {
                cached: false,
                exclude: excludeFromStats
            }
        }
    };
};
