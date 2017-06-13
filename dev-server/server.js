module.exports = function(options) {

    const express = require('express');
    const path = require('path');
    const fs = require('fs');
    // require the page rendering logic
    const Renderer = require('./SimpleRenderer.js');

    const config = require('../config/default/config.json');
    let loaderScriptContent = fs.readFileSync(path.join(__dirname, '../src/loader/index.js')).toString();
    loaderScriptContent = loaderScriptContent
        .replace(
            '\'https://\' + appId + \'.webloader.smooch.io/\'',
            '\'/webloader\''
        );

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
            quiet: false
        }));
    } else {
        // serve the static assets
        app.use('/_assets', express.static(path.join(__dirname, '..', 'dist'), {
            maxAge: '200d' // We can cache them as they include hashes
        }));
        app.use('/', express.static(path.join(__dirname, '..', 'public'), {}));
    }

    app.get('/embedded', function(req, res) {
        const renderer = new Renderer({
            data: config,
            loaderScript: loaderScriptContent,
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

    app.get('/webloader', function(req, res) {
        res.json({
            url:  '/_assets/smooch.js'
        });
    });

    // application
    app.get('/*', function(req, res) {
        const renderer = new Renderer({
            loaderScript: loaderScriptContent,
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
