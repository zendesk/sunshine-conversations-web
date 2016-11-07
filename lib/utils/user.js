'use strict';

exports.__esModule = true;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.isChannelLinked = isChannelLinked;
exports.getDisplayName = getDisplayName;
exports.getLinkableChannels = getLinkableChannels;
exports.hasLinkableChannels = hasLinkableChannels;

var _channels = require('../constants/channels');

var _app = require('./app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isChannelLinked(clients, channelType) {
    return !!clients.find(function (client) {
        return client.platform === channelType;
    });
}

function getDisplayName(clients, channelType) {
    var client = clients.find(function (client) {
        return client.platform === channelType;
    });
    return client && client.displayName;
}

function getLinkableChannels(appChannels, settings) {
    return (0, _keys2.default)(_channels.CHANNEL_DETAILS).filter(function (channelType) {
        if (!_channels.CHANNEL_DETAILS[channelType].isLinkable || !settings.channels[channelType]) {
            return false;
        }

        // don't care about this channel if not enabled for the app
        return (0, _app.getIntegration)(appChannels, channelType);
    });
}

function hasLinkableChannels(appChannels, clients, settings) {
    return getLinkableChannels(appChannels, settings).some(function (channelType) {
        // a channel is not considered as linkable if it's already linked
        return !isChannelLinked(clients, channelType);
    });
}