import { integrations as integrationsAssets } from '../constants/assets';

import { fetchWeChatQRCode } from '../services/integrations-service';

import { MessengerChannelContent } from '../components/channels/messenger-channel-content';
import { EmailChannelContent } from '../components/channels/email-channel-content';
import { TwilioChannelContent } from '../components/channels/twilio-channel-content';
import { WeChatChannelContent } from '../components/channels/wechat-channel-content';
import { LineChannelContent } from '../components/channels/line-channel-content';


export const CHANNEL_DETAILS = {
    messenger: {
        name: 'Facebook Messenger',
        description: 'Connect your Facebook Messenger account to be notified when you get a reply and carry the conversation on Facebook Messenger.',
        isLinkable: true,
        ...integrationsAssets.messenger,
        Component: MessengerChannelContent,
        getURL: (appUser, channel) => `https://m.me/${channel.pageId}`
    },
    frontendEmail: {
        name: 'Email',
        description: 'To talk to us using email just send a message to our email address and we\'ll reply shortly:',
        isLinkable: false,
        ...integrationsAssets.frontendEmail,
        Component: EmailChannelContent
    },
    twilio: {
        name: 'SMS',
        description: 'To talk to us using SMS, just send a text message to this number from your favorite SMS app:',
        isLinkable: false,
        ...integrationsAssets.sms,
        Component: TwilioChannelContent
    },
    telegram: {
        name: 'Telegram',
        description: 'To talk to us using Telegram, add our bot:',
        isLinkable: true,
        ...integrationsAssets.telegram,
        getURL: (appUser, channel, linked) => `https://telegram.me/${channel.username}${!linked ? '?start=' + appUser._id : ''}`
    },
    wechat: {
        name: 'WeChat',
        description: 'To send us a message from WeChat, scan this QR code using the WeChat app.',
        isLinkable: true,
        ...integrationsAssets.wechat,
        Component: WeChatChannelContent,
        onChannelPage: fetchWeChatQRCode,
        renderPageIfLinked: true
    },
    line: {
        name: 'LINE',
        description: 'To talk to us using LINE, search for our official account using the LINE app and send us a message:',
        isLinkable: false,
        ...integrationsAssets.line,
        Component: LineChannelContent
    }
};

Object.keys(CHANNEL_DETAILS).forEach((key) => {
    CHANNEL_DETAILS[key] = {
        renderPageIfLinked: false,
        getURL: () => {},
        onChannelPage: () => Promise.resolve(),
        ...CHANNEL_DETAILS[key]
    };
});
