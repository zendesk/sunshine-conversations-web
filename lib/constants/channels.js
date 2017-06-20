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

var _integrations = require('../services/integrations');

var _assets = require('../constants/assets');

var _messengerChannelContent = require('../components/channels/messenger-channel-content');

var _emailChannelContent = require('../components/channels/email-channel-content');

var _smsChannelContent = require('../components/channels/sms-channel-content');

var _telegramChannelContent = require('../components/channels/telegram-channel-content');

var _wechatChannelContent = require('../components/channels/wechat-channel-content');

var _viberChannelContent = require('../components/channels/viber-channel-content');

var _lineChannelContent = require('../components/channels/line-channel-content');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHANNEL_DETAILS = exports.CHANNEL_DETAILS = {
    messenger: (0, _extends3.default)({
        name: 'Facebook Messenger',
        descriptionKey: 'messengerChannelDescription',
        isLinkable: true
    }, _assets.integrations.messenger, {
        Component: _messengerChannelContent.MessengerChannelContent,
        onChannelPage: function onChannelPage() {
            return (0, _integrations.fetchTransferRequestCode)('messenger');
        },
        getURL: function getURL(channel) {
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
        Component: _smsChannelContent.SMSChannelContent,
        onChannelPage: _integrations.fetchTwilioAttributes
    }),
    messagebird: (0, _extends3.default)({
        name: 'SMS',
        getDescription: function getDescription(_ref2) {
            var text = _ref2.text,
                pendingClient = _ref2.pendingClient;

            if (pendingClient) {
                return text.smsChannelPendingDescription.replace('{number}', pendingClient.displayName);
            }

            return text.smsChannelDescription;
        },
        isLinkable: true
    }, _assets.integrations.sms, {
        renderPageIfLinked: true,
        Component: _smsChannelContent.SMSChannelContent,
        onChannelPage: _integrations.fetchMessageBirdAttributes
    }),
    telegram: (0, _extends3.default)({
        name: 'Telegram',
        descriptionKey: 'telegramChannelDescription',
        isLinkable: true
    }, _assets.integrations.telegram, {
        Component: _telegramChannelContent.TelegramChannelContent,
        onChannelPage: function onChannelPage() {
            return (0, _integrations.fetchTransferRequestCode)('telegram');
        },
        getURL: function getURL(channel) {
            return 'https://telegram.me/' + channel.username;
        }
    }),
    viber: (0, _extends3.default)({
        name: 'Viber',
        descriptionHtmlKey: _ismobilejs2.default.any ? 'viberChannelDescriptionMobile' : 'viberChannelDescription',
        isLinkable: true
    }, _assets.integrations.viber, {
        renderPageIfLinked: !_ismobilejs2.default.any,
        Component: _viberChannelContent.ViberChannelContent,
        onChannelPage: function onChannelPage() {
            if (_ismobilejs2.default.any) {
                return (0, _integrations.fetchTransferRequestCode)('viber');
            } else {
                return (0, _integrations.fetchViberQRCode)();
            }
        },
        getURL: function getURL(channel) {
            return _ismobilejs2.default.any ? 'viber://pa?chatURI=' + channel.uri : undefined;
        }
    }),
    wechat: (0, _extends3.default)({
        name: 'WeChat',
        descriptionHtmlKey: _ismobilejs2.default.any ? 'wechatChannelDescriptionMobile' : 'wechatChannelDescription',
        isLinkable: true
    }, _assets.integrations.wechat, {
        Component: _wechatChannelContent.WeChatChannelContent,
        onChannelPage: _integrations.fetchWeChatQRCode,
        renderPageIfLinked: true
    }),
    line: (0, _extends3.default)({
        name: 'LINE',
        descriptionKey: 'lineChannelDescription',
        isLinkable: false
    }, _assets.integrations.line, {
        Component: !_ismobilejs2.default.any ? _lineChannelContent.LineChannelContent : undefined,
        getURL: function getURL(channel) {
            return 'https://line.me/R/ti/p/@' + channel.lineId;
        }
    }),
    twitter: (0, _extends3.default)({
        name: 'Twitter DM',
        isLinkable: false
    }, _assets.integrations.twitter, {
        getURL: function getURL(channel) {
            return 'https://twitter.com/messages/compose?recipient_id=' + channel.userId;
        }
    })
};

(0, _keys2.default)(CHANNEL_DETAILS).forEach(function (key) {
    CHANNEL_DETAILS[key] = (0, _extends3.default)({
        renderPageIfLinked: false,
        getURL: function getURL() {},
        onChannelPage: function onChannelPage() {
            return function () {
                return _promise2.default.resolve();
            };
        }
    }, CHANNEL_DETAILS[key]);
});