module.exports = function(options) {

    const express = require('express');
    const path = require('path');

    // require the page rendering logic
    const Renderer = require('./SimpleRenderer.js');


    const config = require('../config/default/config.json');

    try {
        Object.assign(config, require('../config/config.json'));
    }
    catch (e) {
        // do nothing
    }

    const app = express();

    if (options.devServer) {
        const webpack = require('webpack');
        const config = require('../webpack-dev-server.config');
        const compiler = webpack(config);
        app.use(require('webpack-dev-middleware')(compiler, {
            publicPath: '/_assets/',
            quiet: true
        }));

        app.use(require('webpack-hot-middleware')(compiler));
    } else {
        // serve the static assets
        app.use('/_assets', express.static(path.join(__dirname, '..', 'dist'), {
            maxAge: '200d' // We can cache them as they include hashes
        }));
        app.use('/', express.static(path.join(__dirname, '..', 'public'), {}));
    }

    app.get('/embedded', function(req, res) {
        const renderer = new Renderer({
            scriptUrl: '/_assets/smooch.js',
            data: config,
            embedded: true
        });

        renderer.render(
            req.path, {}, function(err, html) {
                if (err) {
                    res.statusCode = 500;
                    res.contentType = 'text; charset=utf8';
                    res.end(err.message);
                    return;
                }
                res.contentType = 'text/html; charset=utf8';
                res.end(html);
            }
        );
    });

    // application
    app.get('/*', function(req, res) {
        const renderer = new Renderer({
            scriptUrl: '/_assets/smooch.js',
            data: config
        });

        renderer.render(
            req.path, {}, function(err, html) {
                if (err) {
                    res.statusCode = 500;
                    res.contentType = 'text; charset=utf8';
                    res.end(err.message);
                    return;
                }
                res.contentType = 'text/html; charset=utf8';
                res.end(html);
            }
        );
    });


    const port = process.env.PORT || options.defaultPort || 8080;
    app.listen(port, function() {
        console.log('Server listening on port ' + port); //eslint-disable-line no-console
    });
};
