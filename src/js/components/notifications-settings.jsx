import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { NotificationChannelItem } from './notification-channel-item';

import { getAppChannelDetails } from '../utils/app';
import { isChannelLinked, getDisplayName } from '../utils/user';


export class NotificationsSettingsComponent extends Component {

    static propTypes = {
        appChannels: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired,
        notificationSettingsChannelsTitleText: PropTypes.string.isRequired,
        notificationSettingsChannelsDescriptionText: PropTypes.string.isRequired
    };

    render() {
        const {appChannels, user, notificationSettingsChannelsTitleText, notificationSettingsChannelsDescriptionText } = this.props;

        if (!user._id) {
            return null;
        }

        let channels = getAppChannelDetails(appChannels);
        channels.sort(({channel}) => {
            // List the linked channels first
            return isChannelLinked(user.clients, channel.type) ? -1 : 1;
        });

        channels = channels.map(({channel, details}) => {
            return <NotificationChannelItem key={ channel.type }
                                            id={ channel.type }
                                            {...details}
                                            displayName={ getDisplayName(user.clients, channel.type) }
                                            linked={ isChannelLinked(user.clients, channel.type) }
                                            hasURL={ details.getURL && details.getURL(user, channel) } />;
        });

        return <div className='content-wrapper'>
                   <div className='settings-wrapper'>
                       <p className='settings-header'>
                           { notificationSettingsChannelsTitleText }
                       </p>
                       <p className='settings-description'>
                           { notificationSettingsChannelsDescriptionText }
                       </p>
                       <div className='channels'>
                           { channels }
                       </div>
                   </div>
               </div>;
    }
}

export const NotificationsSettings = connect(({app, user, ui}) => {
    return {
        appChannels: app.integrations,
        notificationSettingsChannelsTitleText: ui.text.notificationSettingsChannelsTitle,
        notificationSettingsChannelsDescriptionText: ui.text.notificationSettingsChannelsDescription,
        user
    };
})(NotificationsSettingsComponent);
