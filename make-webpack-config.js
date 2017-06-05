const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const StatsPlugin = require('stats-webpack-plugin');
const rulesByExtension = require('./webpack/lib/rulesByExtension');

module.exports = function(options) {
    const VERSION = require('./package.json').version;
    const PACKAGE_NAME = require('./package.json').name;
    const LICENSE = fs.readFileSync('LICENSE', 'utf8');

    const config = require('./config/default/config.json');

    try {
        Object.assign(config, require('./config/config.json'));
    }
    catch (e) {
        // do nothing
    }

    let entry;

    if (options.hostOnly) {
        entry = {
            [options.npmRelease ? 'index' : 'smooch']: './src/host/js/umd'
        };
    } else if (options.frameOnly) {
        entry = {
            frame: './src/frame/js/index'
        };
    } else {
        entry = {
            host: './src/host/js/umd',
            frame: './src/frame/js/index'
        };
    }

    const fileLimit = options.bundleAll ? 100000 : 1;


    const rules = {
        'png|jpg|jpeg|gif|svg': {
            loader: 'url-loader',
            options: {
                limit: fileLimit
            }
        },
        'mp3': {
            loader: 'url-loader',
            options: {
                limit: fileLimit
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
        options.devServer ?
            '/_assets/' :
            'https://cdn.smooch.io/';

    const baseFilename = (options.frameOnly || options.hostOnly) && !options.npmRelease ?
        `[name].${VERSION}` :
        '[name]';

    const fileExtension = options.minimize ?
        '.min.js' :
        '.js';

    const output = {
        path: options.outputPath || path.join(__dirname, 'dist'),
        publicPath,
        filename: baseFilename + fileExtension,
        chunkFilename: options.devServer ? '[id].js' : '[name].js',
        sourceMapFilename: '[file].map',
        library: (options.npmRelease || options.frameOnly) ? undefined : 'Smooch',
        libraryTarget: options.npmRelease ? 'commonjs2' : 'var',
        pathinfo: options.debug
    };

    const excludeFromStats = [
        /node_modules[\\\/]/
    ];

    const baseFrameFileame = (options.frameOnly || options.hostOnly) ? `frame.${VERSION}` : 'frame';

    const plugins = [
        new webpack.DefinePlugin({
            FRAME_LIB_URL: `'${publicPath}${baseFrameFileame}${fileExtension}'`
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
        externals: options.npmRelease ? ['enquire.js'] : undefined,
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
