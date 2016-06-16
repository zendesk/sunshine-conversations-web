import { CHANNEL_DETAILS } from '../constants/channels';

export function getIntegration(appChannels, type) {
    const appChannelsOfType = appChannels.filter((channel) => channel.type === type);
    return appChannelsOfType.length > 0 ? appChannelsOfType[0] : undefined;
}

export function hasChannels({channels}) {
    return Object.keys(channels).some((key) => channels[key]);
}

export function getAppChannelDetails(appChannels) {
    return Object.keys(CHANNEL_DETAILS)
        .map((key) => getIntegration(appChannels, key))
        .filter((channel) => channel)
        .map((channel) => {
            return {
                channel,
                details: CHANNEL_DETAILS[channel.type]
            };
        });
}
