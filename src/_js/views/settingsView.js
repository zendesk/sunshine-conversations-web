var Marionette = require('backbone.marionette');
var _ = require('underscore');
var $ = require('jquery');
var bindAll = require('lodash.bindall');

var template = require('../../templates/settings.tpl');

module.exports = Marionette.ItemView.extend({
    id: 'sk-settings',
    template: template,

    ui: {
        email: '[data-ui-email]',
        saveButton: '[data-ui-save]',
        formMessage: '[data-ui-form-message]',
        form: '[data-ui-form]'
    },

    behaviors: {
        stickit: {
            '@ui.email': {
                observe: 'email',
                onSet: 'onEmailSet',
                update: 'emailUpdate'
            }
        }
    },

    triggers: {
        'click @ui.saveButton': 'settings:save'
    },

    events: {
        'submit @ui.form': 'onFormSubmit'
    },

    initialize: function() {
        bindAll(this);
    },

    emailUpdate: function($el, val) {
        $el.val(val);

        if (this.getOption('readOnlyEmail')) {
            $el.attr('disabled', true);
        }
    },

    onEmailSet: function(value) {
        // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        var isValid = regex.test(value);

        if (isValid) {
            this.ui.email.parent().removeClass('has-error');
            this.ui.saveButton.removeAttr('disabled');
        } else {
            this.ui.email.parent().addClass('has-error');
            this.ui.saveButton.attr('disabled', true);
        }

        return value;
    },

    onFormSubmit: function(event) {
        event.preventDefault();

        var hasError = this.ui.email.parent().hasClass('has-error');

        if (!hasError) {
            this.trigger('settings:save');
        }
    },

    showSavedMessage: function() {
        var $message = $('<span><i class="fa fa-check success"></i> Saved!</span>');

        var hideMessage = function() {
            $message.fadeOut(500, $message.remove);
        };

        this.ui.formMessage.append($message);
        _(hideMessage).chain().bind(this).delay(400);

    },

    serializeData: function() {
        var data = Marionette.ItemView.prototype.serializeData.apply(this, _.toArray(arguments));

        return _.extend(data, {
            readOnlyEmail: this.getOption('readOnlyEmail'),
            settingsText: this.getOption('settingsText'),
            settingsReadOnlyText: this.getOption('settingsReadOnlyText'),
            settingsInputPlaceholder: this.getOption('settingsInputPlaceholder'),
            settingsSaveButtonText: this.getOption('settingsSaveButtonText')
        });
    },

    onRender: function() {
        this.$el.hide();

        _.defer(_.bind(this.transitionIn, this));
    },

    transitionIn: function() {
        this.$el.animate({
            width: 'toggle',
            opacity: 1
        }, 250);
    },

    transitionOut: function(cb) {
        this.$el.animate({
            width: 'toggle',
            opacity: 0
        }, 250, cb);
    },

    remove: function() {
        var parentRemove = _.bind(function() {
            Marionette.ItemView.prototype.remove.call(this);
        }, this);

        // Calls parent's `view` method after animation completes
        this.transitionOut(parentRemove);
    }
});
