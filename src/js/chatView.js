var Backbone = require('backbone');

var template = require('../templates/chatView.tpl');

var HeaderView = require('./headerView');
var ConversationView = require('./conversationView');
var ChatInputView = require('./chatInputView');
var _ = require("underscore");

var ChatView = Backbone.View.extend({
    render: function() {
        this.$el.html(template());

        this.header = new HeaderView({
            el: this.$el.find("#sk-header")
        });
        this.conversation = new ConversationView({
            el: this.$el.find("#sk-conversation"),
            model : this.model
        });

        this.chatInput = new ChatInputView({
            el: this.$el.find("#sk-footer")
        });

        this.header.render();
        this.conversation.render();
        this.chatInput.render();

        return this;
    }
});

module.exports = ChatView;