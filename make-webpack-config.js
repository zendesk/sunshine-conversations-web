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
        smooch: './src/js/main'
    };

    var loaders = {
        'jsx': options.hotComponents ? ['react-hot-loader', 'babel-loader'] : 'babel-loader',
        'js': {
            loader: 'babel-loader',
            include: path.join(__dirname, 'src/js')
        },
        'json': 'json-loader',
        'tpl': 'ejs-loader',
        'coffee': 'coffee-redux-loader',
        'json5': 'json5-loader',
        'txt': 'raw-loader',
        'png|jpg|jpeg|gif|svg': 'url-loader?limit=10000',
        'woff|woff2': 'url-loader?limit=100000',
        'ttf|eot': 'file-loader',
        'wav|mp3': 'file-loader',
        'html': 'html-loader',
        'md|markdown': ['html-loader', 'markdown-loader']
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
    var alias = {

    };
    var aliasLoader = {

    };
    var externals = [];
    var modulesDirectories = ['web_modules', 'node_modules'];
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
        /node_modules[\\\/]react[\\\/]/,
        /node_modules[\\\/]redux[\\\/]/
    ];

    var noParse = [
        ///node_modules\/sinon\//
    ];

    var plugins = [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(VERSION)
        }),

        new webpack.ProvidePlugin({
            _: 'underscore'
        })
    ];
    // add these back for react support
    // plugins.push(new webpack.PrefetchPlugin('react'));
    // plugins.push(new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment'));

    if (!options.test) {
        plugins.push(new StatsPlugin('stats.json', {
            chunkModules: true,
            exclude: excludeFromStats
        }));
    }

    if (options.commonsChunk) {
        plugins.push(new webpack.optimize.CommonsChunkPlugin('commons', 'commons.js' + (options.longTermCaching ? '?[chunkhash]' : '')));
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
        new webpack.optimize.DedupePlugin()
        );

        plugins.push(
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
            loaders: [loadersByExtension(loaders)].concat(loadersByExtension(stylesheetLoaders)).concat(additionalLoaders),
            noParse: noParse
        },
        devtool: options.devtool,
        debug: options.debug,
        resolveLoader: {
            root: path.join(__dirname, 'node_modules'),
            alias: aliasLoader
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
