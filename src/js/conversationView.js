var Backbone = require('backbone');

var template = require('../templates/conversationView.tpl');
var MessageView = require('./messageView');
var _ = require('underscore');

var conversationView = Backbone.View.extend({
    initialize: function() {
        this.model.on("add", _.bind(this.addOne, this));
        this.model.on("reset", _.bind(this.addAll, this));
    },
    render: function() {
        this.$el.html(template());
        this.addAll();
        
        return this;
    },
    addOne: function(message) {
        var view = new MessageView({
            model: message
        });
        view.render();
        this.$el.append(view.el);
        this.scrollToBottom();
    },
    addAll : function(){
        this.$el.html('');
        this.model.each(this.addOne, this);
    },
    scrollToBottom: function() {
        this.$el.stop().animate({
            scrollTop: this.$el.get(0).scrollHeight
        }, 400);
    }
});

module.exports = conversationView;