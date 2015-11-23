var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');
var loadersByExtension = require('./config/build/loadersByExtension');

module.exports = function(options) {
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
        'less': [cssLoader, 'less-loader'],
        'styl': [cssLoader, 'stylus-loader'],
        'scss|sass': [cssLoader, 'sass-loader']
    };
    var additionalLoaders = [
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
        path: path.join(__dirname, 'build', 'public'),
        publicPath: publicPath,
        filename: '[name].js' + (options.longTermCaching ? '?[chunkhash]' : ''),
        chunkFilename: (options.devServer ? '[id].js' : '[name].js') + (options.longTermCaching ? '?[chunkhash]' : ''),
        sourceMapFilename: 'debugging/[file].map',
        libraryTarget: undefined,
        pathinfo: options.debug
    };

    var excludeFromStats = [
        /node_modules[\\\/]react[\\\/]/,
        /node_modules[\\\/]redux[\\\/]/
    ];

    var plugins = [
        new webpack.PrefetchPlugin('react'),
        new webpack.PrefetchPlugin('react/lib/ReactComponentBrowserEnvironment')
    ];
    plugins.push(new StatsPlugin(path.join('..', 'stats.json'), {
        chunkModules: true,
        exclude: excludeFromStats
    }));

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
        new webpack.NoErrorsPlugin()
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
