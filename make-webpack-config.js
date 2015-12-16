var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
var loadersByExtension = require('./webpack/lib/loadersByExtension');

module.exports = function(options) {
    var VERSION = require('./package.json').version;
    var PACKAGE_NAME = require('./package.json').name;
    var LICENSE = fs.readFileSync('LICENSE', 'utf8');

    var entry = {
        smooch: ['babel-polyfill', './src/js/main']
    };

    var loaders = {
        'jsx': options.hotComponents ? ['react-hot-loader', 'babel-loader'] : 'babel-loader',
        'js': {
            loader: 'babel-loader',
            include: [path.join(__dirname, 'src/js'), path.join(__dirname, 'test')]
        },
        'json': 'json-loader',
        'txt': 'raw-loader',
        'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000',
        'woff|woff2': 'url-loader?limit=100000',
        'ttf|eot': 'file-loader'
    };
    var cssLoader = options.minimize ? 'css-loader?insertAt=top' : 'css-loader?insertAt=top&localIdentName=[path][name]---[local]---[hash:base64:5]';
    var stylesheetLoaders = {
        'css': cssLoader,
        'less': [cssLoader, 'less-loader']
    };
    var additionalLoaders = [
        {
            test: /\.js$/,
            loader: 'imports?define=>false'
        },
        {
            test: /src\/js\/main/,
            loader: 'expose?Smooch'
        }
    ];
    var alias = {};

    if (options.test) {
        Object.assign(alias, {
            test: __dirname + '/test',
            bootstrapTest: 'test/bootstrap'
        });
    }

    var externals = [];
    var modulesDirectories = ['node_modules', 'src', 'src/js'];
    var extensions = ['', '.web.js', '.js', '.jsx'];
    var root = path.join(__dirname, 'src');
    var publicPath = options.devServer ?
        'http://localhost:2992/_assets/' :
        '/_assets/';

    var output = {
        path: path.join(__dirname, 'dist'),
        publicPath: publicPath,
        filename: '[name].js' + (options.longTermCaching ? '?[chunkhash]' : ''),
        chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching ? '?[chunkhash]' : ''),
        sourceMapFilename: '[file].map',
        library: 'Smooch',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        pathinfo: options.debug
    };

    var excludeFromStats = [
        /node_modules[\\\/]/,
    ];

    var plugins = [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(VERSION)
        }),
        new webpack.PrefetchPlugin('react'),
        new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment')
    ];


    if (options.test) {
        additionalLoaders.push({
            test: /\.spec\.js$/,
            loader: 'imports?bootstrapTest'
        });
        additionalLoaders.push({
            test: /\.spec\.jsx$/,
            loader: 'imports?bootstrapTest'
        });
    } else {
        plugins.push(new StatsPlugin('stats.json', {
            chunkModules: true,
            exclude: excludeFromStats
        }));
    }

    Object.keys(stylesheetLoaders).forEach(function(ext) {
        var stylesheetLoader = stylesheetLoaders[ext];
        if (Array.isArray(stylesheetLoader)) {
            stylesheetLoader = stylesheetLoader.join('!');
        }
        if (options.separateStylesheet) {
            stylesheetLoaders[ext] = ExtractTextPlugin.extract('style-loader', stylesheetLoader);
        } else {
            stylesheetLoaders[ext] = 'style-loader!' + stylesheetLoader;
        }
    });
    if (options.separateStylesheet) {
        plugins.push(new ExtractTextPlugin('[name].css' + (options.longTermCaching ? '?[contenthash]' : '')));
    }

    if (options.minimize) {

        plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.NoErrorsPlugin(),

        new webpack.BannerPlugin(PACKAGE_NAME + ' ' + VERSION + ' \n' + LICENSE, {
            entryOnly: true
        })
        );
    }

    return {
        entry: entry,
        output: output,
        target: 'web',
        module: {
            loaders: [loadersByExtension(loaders)].concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders)
        },
        devtool: options.devtool,
        debug: options.debug,
        resolveLoader: {
            root: path.join(__dirname, 'node_modules')
        },
        externals: externals,
        resolve: {
            root: root,
            modulesDirectories: modulesDirectories,
            extensions: extensions,
            alias: alias
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
