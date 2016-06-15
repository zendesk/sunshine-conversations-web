import { CHANNELS_DETAILS } from '../constants/channels';
import { getIntegration } from './app';

export function isChannelLinked(clients, channelType) {
    return !!clients.find((client) => client.platform === channelType);
}

export function getDisplayName(clients, channelType) {
    const client = clients.find((client) => client.platform === channelType);
    return client && client.displayName;
}

export function hasLinkableChannels(appChannels, clients, settings) {
    return Object.keys(CHANNELS_DETAILS)
        .filter((channelType) => CHANNELS_DETAILS[channelType].isLinkable && settings.channels[channelType])
        .some((channelType) => {
            const integration = getIntegration(appChannels, channelType);

            // don't care about this channel if not enabled for the app
            if (!integration) {
                return false;
            }

            // a channel is not considered as linkable if it's already linked
            return !isChannelLinked(clients, channelType);
        });
}
