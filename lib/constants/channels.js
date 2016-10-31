'use strict';

exports.__esModule = true;
exports.CHANNEL_DETAILS = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _ismobilejs = require('ismobilejs');

var _ismobilejs2 = _interopRequireDefault(_ismobilejs);

var _assets = require('../constants/assets');

var _integrationsService = require('../services/integrations-service');

var _messengerChannelContent = require('../components/channels/messenger-channel-content');

var _emailChannelContent = require('../components/channels/email-channel-content');

var _twilioChannelContent = require('../components/channels/twilio-channel-content');

var _wechatChannelContent = require('../components/channels/wechat-channel-content');

var _lineChannelContent = require('../components/channels/line-channel-content');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHANNEL_DETAILS = exports.CHANNEL_DETAILS = {
    messenger: (0, _extends3.default)({
        name: 'Facebook Messenger',
        descriptionKey: 'messengerChannelDescription',
        isLinkable: true
    }, _assets.integrations.messenger, {
        Component: _messengerChannelContent.MessengerChannelContent,
        getURL: function getURL(appUser, channel) {
            return 'https://m.me/' + channel.pageId;
        }
    }),
    frontendEmail: (0, _extends3.default)({
        name: 'Email',
        descriptionKey: 'frontendEmailChannelDescription',
        isLinkable: false
    }, _assets.integrations.frontendEmail, {
        Component: _emailChannelContent.EmailChannelContent
    }),
    twilio: (0, _extends3.default)({
        name: 'SMS',
        getDescription: function getDescription(_ref) {
            var text = _ref.text,
                pendingClient = _ref.pendingClient;

            if (pendingClient) {
                return text.smsChannelPendingDescription.replace('{number}', pendingClient.displayName);
            }

            return text.smsChannelDescription;
        },
        isLinkable: true
    }, _assets.integrations.sms, {
        renderPageIfLinked: true,
        Component: _twilioChannelContent.TwilioChannelContent,
        onChannelPage: _integrationsService.fetchTwilioAttributes
    }),
    telegram: (0, _extends3.default)({
        name: 'Telegram',
        descriptionKey: 'telegramChannelDescription',
        isLinkable: true
    }, _assets.integrations.telegram, {
        getURL: function getURL(appUser, channel, linked) {
            return 'https://telegram.me/' + channel.username + (!linked ? '?start=' + appUser._id : '');
        }
    }),
    wechat: (0, _extends3.default)({
        name: 'WeChat',
        descriptionHtmlKey: _ismobilejs2.default.any ? 'wechatChannelDescriptionMobile' : 'wechatChannelDescription',
        isLinkable: true
    }, _assets.integrations.wechat, {
        Component: _wechatChannelContent.WeChatChannelContent,
        onChannelPage: _integrationsService.fetchWeChatQRCode,
        renderPageIfLinked: true
    }),
    line: (0, _extends3.default)({
        name: 'LINE',
        descriptionKey: 'lineChannelDescription',
        isLinkable: false
    }, _assets.integrations.line, {
        Component: _lineChannelContent.LineChannelContent
    })
};

(0, _keys2.default)(CHANNEL_DETAILS).forEach(function (key) {
    CHANNEL_DETAILS[key] = (0, _extends3.default)({
        renderPageIfLinked: false,
        getURL: function getURL() {},
        onChannelPage: function onChannelPage() {
            return _promise2.default.resolve();
        }
    }, CHANNEL_DETAILS[key]);
});