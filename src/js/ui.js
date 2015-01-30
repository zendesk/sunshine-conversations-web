var SupportKit = require('./main.js');
var ChatView = require('./chatView');


(function(root) {

    // expose the ui
    root.SupportKit = root.SupportKit || {};
    root.SupportKit.ui = root.SupportKit.ui || {};

    var ui = root.SupportKit.ui;

    $(function() {

        SupportKit.on('ready', function() {
            var el = $("<div/>").appendTo("body");

            ui.chatView = new ChatView({
                el: el,
                model: SupportKit.conversation
            });

            ui.chatView.render();
        });

    });

    ui.open = function() {
        if (ui.chatView) {
            ui.chatView.open();
        }
    }

    ui.close = function() {
        if (ui.chatView) {
            ui.chatView.close();
        }
    }

    ui.toggle = function() {
        if (ui.chatView) {
            ui.chatView.toggle();
        }
    }

}(window));


module.exports = window.SupportKit.ui;