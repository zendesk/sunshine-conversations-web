import { LINKABLE_CHANNELS } from '../constants/channels';
import { getIntegration } from './app';

export function isChannelLinked(clients, channelType) {
    return !!clients.find((client) => client.platform === channelType);
}

export function hasLinkableChannels(appChannels, clients, settings) {
    return LINKABLE_CHANNELS.some((channelType) => {
        if (!settings.channels[channelType]) {
            return false;
        }

        const integration = getIntegration(appChannels, channelType);

        // don't care about this channel if not enabled for the app
        if (!integration) {
            return false;
        }

        // a channel is not considered as linkable if it's already linked
        return !isChannelLinked(clients, channelType);
    });
}
