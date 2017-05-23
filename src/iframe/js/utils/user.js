import { CHANNEL_DETAILS } from '../constants/channels';
import { getIntegration } from './app';

export function isChannelLinked(clients, channelType) {
    return !!clients.find((client) => client.platform === channelType);
}

export function getDisplayName(clients, channelType) {
    const client = clients.find((client) => client.platform === channelType);
    return client && client.displayName;
}

export function getLinkableChannels(appChannels, settings) {
    return Object.keys(CHANNEL_DETAILS)
        .filter((channelType) => {
            if (!CHANNEL_DETAILS[channelType].isLinkable || !settings.channels[channelType]) {
                return false;
            }

            // don't care about this channel if not enabled for the app
            return getIntegration(appChannels, channelType);
        });
}

export function hasLinkableChannels(appChannels, clients, settings) {
    return getLinkableChannels(appChannels, settings)
        .some((channelType) => {
            // a channel is not considered as linkable if it's already linked
            return !isChannelLinked(clients, channelType);
        });
}
