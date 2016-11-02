import isMobile from 'ismobilejs';

import { integrations as integrationsAssets } from '../constants/assets';

import { fetchWeChatQRCode, fetchTwilioAttributes } from '../services/integrations-service';

import { MessengerChannelContent } from '../components/channels/messenger-channel-content';
import { EmailChannelContent } from '../components/channels/email-channel-content';
import { TwilioChannelContent } from '../components/channels/twilio-channel-content';
import { WeChatChannelContent } from '../components/channels/wechat-channel-content';
import { LineChannelContent } from '../components/channels/line-channel-content';

export const CHANNEL_DETAILS = {
    messenger: {
        name: 'Facebook Messenger',
        descriptionKey: 'messengerChannelDescription',
        isLinkable: true,
        ...integrationsAssets.messenger,
        Component: MessengerChannelContent,
        getURL: (appUser, channel) => `https://m.me/${channel.pageId}`
    },
    frontendEmail: {
        name: 'Email',
        descriptionKey: 'frontendEmailChannelDescription',
        isLinkable: false,
        ...integrationsAssets.frontendEmail,
        Component: EmailChannelContent
    },
    twilio: {
        name: 'SMS',
        getDescription: ({text, pendingClient}) => {
            if (pendingClient) {
                return text.smsChannelPendingDescription.replace('{number}', pendingClient.displayName);
            }

            return text.smsChannelDescription;
        },
        isLinkable: true,
        ...integrationsAssets.sms,
        renderPageIfLinked: true,
        Component: TwilioChannelContent,
        onChannelPage: fetchTwilioAttributes
    },
    telegram: {
        name: 'Telegram',
        descriptionKey: 'telegramChannelDescription',
        isLinkable: true,
        ...integrationsAssets.telegram,
        getURL: (appUser, channel, linked) => `https://telegram.me/${channel.username}${!linked ? '?start=' + appUser._id : ''}`
    },
    wechat: {
        name: 'WeChat',
        descriptionHtmlKey: isMobile.any ? 'wechatChannelDescriptionMobile' : 'wechatChannelDescription',
        isLinkable: true,
        ...integrationsAssets.wechat,
        Component: WeChatChannelContent,
        onChannelPage: fetchWeChatQRCode,
        renderPageIfLinked: true
    },
    line: {
        name: 'LINE',
        descriptionKey: 'lineChannelDescription',
        isLinkable: false,
        ...integrationsAssets.line,
        Component: !isMobile.phone ? LineChannelContent : undefined,
        getURL: (appUser, {qrCodeUrl}) => {
            const channelId = /^https?:\/\/qr-official.line.me\/sid\/L\/([a-zA-Z0-9]{3,})\.png$/.exec(qrCodeUrl)[1];
            return `https://line.me/R/ti/p/@${channelId}`;
        }
    }
};

Object.keys(CHANNEL_DETAILS).forEach((key) => {
    CHANNEL_DETAILS[key] = {
        renderPageIfLinked: false,
        getURL: () => {
        },
        onChannelPage: () => Promise.resolve(),
        ...CHANNEL_DETAILS[key]
    };
});
