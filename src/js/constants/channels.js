import isMobile from 'ismobilejs';

import { fetchTransferRequestCode } from '../services/integrations';

import { integrations as integrationsAssets } from '../constants/assets';

import { fetchViberQRCode, fetchWeChatQRCode, fetchTwilioAttributes } from '../services/integrations';

import { MessengerChannelContent } from '../components/channels/messenger-channel-content';
import { EmailChannelContent } from '../components/channels/email-channel-content';
import { TwilioChannelContent } from '../components/channels/twilio-channel-content';
import { TelegramChannelContent } from '../components/channels/telegram-channel-content';
import { WeChatChannelContent } from '../components/channels/wechat-channel-content';
import { ViberChannelContent } from '../components/channels/viber-channel-content';
import { LineChannelContent } from '../components/channels/line-channel-content';

export const CHANNEL_DETAILS = {
    messenger: {
        name: 'Facebook Messenger',
        descriptionKey: 'messengerChannelDescription',
        isLinkable: true,
        ...integrationsAssets.messenger,
        Component: MessengerChannelContent,
        onChannelPage: () => fetchTransferRequestCode('messenger'),
        getURL: (channel) => `https://m.me/${channel.pageId}`
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
        Component: TelegramChannelContent,
        onChannelPage: () => fetchTransferRequestCode('telegram'),
        getURL: (channel) => `https://telegram.me/${channel.username}` 
    },
    viber: {
        name: 'Viber',
        descriptionHtmlKey: isMobile.any ? 'viberChannelDescriptionMobile' : 'viberChannelDescription',
        isLinkable: true,
        ...integrationsAssets.viber,
        renderPageIfLinked: !isMobile.any,
        Component: ViberChannelContent,
        onChannelPage: () => {
            if (isMobile.any) {
                return fetchTransferRequestCode('viber');
            } else {
                return fetchViberQRCode();
            }
        },
        getURL: (channel) => isMobile.any ? `viber://pa?chatURI=${channel.uri}` : undefined
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
        Component: !isMobile.any ? LineChannelContent : undefined,
        getURL: (channel) => `https://line.me/R/ti/p/@${channel.lineId}`
    },
    twitter: {
        name: 'Twitter DM',
        isLinkable: false,
        ...integrationsAssets.twitter,
        getURL: (channel) => `https://twitter.com/messages/compose?recipient_id=${channel.userId}`
    }
};

Object.keys(CHANNEL_DETAILS).forEach((key) => {
    CHANNEL_DETAILS[key] = {
        renderPageIfLinked: false,
        getURL: () => {
        },
        onChannelPage: () => () => Promise.resolve(),
        ...CHANNEL_DETAILS[key]
    };
});
