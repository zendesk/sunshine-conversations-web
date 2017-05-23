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

    const entry = options.assetsOnly ? {
        'assets': './src/js/constants/assets'
    } : {
        'smooch': ['./src/js/utils/polyfills', './src/js/umd']
    };

    if (options.hotComponents && !options.assetsOnly) {
        entry.smooch.unshift('webpack-hot-middleware/client');
    }

    const fileLimit = options.bundleAll ? 100000 : 1;

    const rules = {
        'jsx': options.hotComponents ? ['react-hot-loader', 'babel-loader'] : 'babel-loader',
        'js': {
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, 'src/js'),
                path.resolve(__dirname, 'test')
            ]
        },
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

    const stylesheetLoaders = {
        'css': ['style-loader/useable', 'css-loader?insertAt=top'],
        'less': ['style-loader/useable', 'css-loader?insertAt=top', 'less-loader']
    };

    const publicPath = options.devServer ?
        '/_assets/' :
        'https://cdn.smooch.io/';

    const output = {
        path: options.outputPath || path.join(__dirname, 'dist'),
        publicPath: publicPath,
        filename: '[name].js' + (options.longTermCaching ? '?[chunkhash]' : ''),
        chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching ? '?[chunkhash]' : ''),
        sourceMapFilename: '[file].map',
        library: options.assetsOnly ? undefined : 'Smooch',
        libraryTarget: options.assetsOnly ? 'commonjs2' : 'var',
        pathinfo: options.debug
    };

    const excludeFromStats = [
        /node_modules[\\\/]/
    ];

    const plugins = [
        new webpack.PrefetchPlugin('react'),
        new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment')
    ];

    if (!options.test && !options.assetsOnly) {
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
    } else if (options.test) {
        plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('test')
                }
            })
        );
    } else if (options.assetsOnly) {
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

    if (options.hotComponents) {
        plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin()
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
            rules: rulesByExtension(rules).concat(rulesByExtension(stylesheetLoaders))
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
