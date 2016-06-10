import React from 'react';

import { integrations as integrationsAssets } from '../constants/assets';
import { MessengerChannelContent } from '../components/channels/messenger-channel-content';
import { GenericChannelContent } from '../components/channels/generic-channel-content';

export const LINKABLE_CHANNELS = ['messenger'];

export const CHANNELS_DETAILS = {
    messenger: {
        name: 'Facebook Messenger',
        description: 'Connect your Facebook Messenger account to be notified when you get a reply and carry the conversation on Facebook Messenger.',
        Component: MessengerChannelContent,
        getLink: (appUser, channel) => `https://m.me/${channel.pageId}`,
        ...integrationsAssets.messenger
    },
    line: {
        name: 'LINE',
        description: 'Connect your LINE account.',
        Component: GenericChannelContent,
        getLink: () => {},
        getContent: () => '',
        ...integrationsAssets.line
    },
    wechat: {
        name: 'WeChat',
        description: 'Connect your WeChat account.',
        Component: GenericChannelContent,
        getLink: () => {},
        getContent: () => '',
        ...integrationsAssets.wechat
    },
    telegram: {
        name: 'Telegram',
        description: 'Connect your Telegram account.',
        Component: GenericChannelContent,
        getLink: () => {},
        getContent: () => '',
        ...integrationsAssets.telegram
    },
    frontendEmail: {
        name: 'Email',
        description: 'Connect your Email account.',
        Component: GenericChannelContent,
        getLink: () => {},
        getContent: ({fromAddress, smoochAddress}) => {
            const email = fromAddress || smoochAddress;

            return <a href={`mailto:${email}`} target='_blank'>{email}</a>;
        },
        ...integrationsAssets.frontendEmail
    },
    sms: {
        name: 'SMS',
        description: 'Connect your SMS account.',
        Component: GenericChannelContent,
        getLink: () => {},
        getContent: () => '',
        ...integrationsAssets.sms
    }
};
