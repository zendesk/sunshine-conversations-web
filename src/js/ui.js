var SupportKit = require('./main.js');
var ChatView = require('./chatView');


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
        if (!$("#" + styleId).length && SupportKit && SupportKit['dist/style.min.css']) {
            $("<style>").attr({
                id: styleId
            }).appendTo("body").text(SupportKit['dist/style.min.css']);
        }
    }

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