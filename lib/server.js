module.exports = function(options) {

    var express = require('express');
    var bodyParser = require('body-parser');
    var path = require('path');

    // require the page rendering logic
    var Renderer = require('./SimpleRenderer.js');

    // load bundle information from stats
    var stats = require('../build/stats.json');

    var publicPath = stats.publicPath;

    var renderer = new Renderer({
        scriptUrl: publicPath + [].concat(stats.assetsByChunkName.smooch)[0],
        data: require('../config/config.json')
    });

    var app = express();

    // serve the static assets
    app.use('/_assets', express.static(path.join(__dirname, '..', 'dist', 'public'), {
        maxAge: '200d' // We can cache them as they include hashes
    }));
    app.use('/', express.static(path.join(__dirname, '..', 'public'), {
    }));

    app.use(bodyParser.json());

    // application
    app.get('/*', function(req, res) {
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


    var port = process.env.PORT || options.defaultPort || 8080;
    app.listen(port, function() {
        console.log('Server listening on port ' + port);
    });
};
