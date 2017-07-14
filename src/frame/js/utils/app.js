import { CHANNEL_DETAILS } from '../constants/channels';

function getTimestamp(objectId) {
    return new Date(parseInt(objectId.toString().slice(0, 8), 16) * 1000);
}

export function getIntegration(appChannels, type) {
    const appChannelsOfType = appChannels.filter((channel) => channel.type === type);
    return appChannelsOfType.length > 0 ? appChannelsOfType[0] : undefined;
}

export function hasChannels({integrations}) {
    return integrations.some(({type}) => CHANNEL_DETAILS[type]);
}

export function getAppChannelDetails(appChannels) {
    let smsIntegrationDate;

    return Object.keys(CHANNEL_DETAILS)
        .map((key) => getIntegration(appChannels, key))
        .filter((channel) => channel)
        .filter((channel) => {
            const {name} = CHANNEL_DETAILS[channel.type];

            if (name === 'SMS') {
                const channelIntegrationDate = getTimestamp(channel._id);

                if (!smsIntegrationDate) {
                    smsIntegrationDate = channelIntegrationDate;
                }

                if (smsIntegrationDate.getTime() < channelIntegrationDate.getTime()) {
                    return false;
                }
            }

            return true;
        })
        .map((channel) => {

            return {
                channel,
                details: {
                    type: channel.type,
                    ...CHANNEL_DETAILS[channel.type]
                }
            };
        });
}
