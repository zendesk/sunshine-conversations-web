var $ = require('jquery');
var SupportKit = require('./main.js');
var ChatView = require('./chatView');

var style = require('../../dist/style.min.css');

(function(root) {
    // expose the ui
    root.SupportKit = root.SupportKit || {};
    root.SupportKit.ui = root.SupportKit.ui || {};

    var ui = root.SupportKit.ui;

    SupportKit.on('ready', function() {
        $(function() {
            injectCss();
            var el = $("<div/>").appendTo("body");

            ui.chatView = new ChatView({
                el: el,
                model: SupportKit.conversation
            });

            ui.chatView.render();
        });
    });

    function injectCss() {
        var styleId = "sk-style";
        if (!$("#" + styleId).length && style) {
            $("<style>").attr({
                id: styleId
            }).appendTo("body").text(style);
        }
    }

    ui.open = function() {
        if (ui.chatView) {
            ui.chatView.open();
        }
    };

    ui.close = function() {
        if (ui.chatView) {
            ui.chatView.close();
        }
    };

    ui.toggle = function() {
        if (ui.chatView) {
            ui.chatView.toggle();
        }
    };

}(window));

// Since this is the entry point to SK, should expose full SK object (not just ui)
module.exports = window.SupportKit;