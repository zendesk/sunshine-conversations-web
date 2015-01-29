var Backbone = require('backbone');

var template = require('../templates/chatView.tpl');

var HeaderView = require('./headerView');
var ConversationView = require('./conversationView');

var ChatView = Backbone.View.extend({
    initialize: function() {},
    render: function() {
        this.$el.html(template());

        this.header = new HeaderView({
            el: this.$el.find("#sk-header")
        });
        this.conversation = new ConversationView({
            el: this.$el.find("#sk-conversation")
        });

        this.header.render();
        this.conversation.render();
        return this;
    }
});

module.exports = ChatView;