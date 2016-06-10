import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { showChannelPage } from '../services/app-service';
import { getAppChannelDetails } from '../utils/app';
import { isChannelLinked } from '../utils/user';

export class ChannelItem extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        linked: PropTypes.bool.isRequired,
        link: PropTypes.string,
        icon: PropTypes.string.isRequired,
        icon2x: PropTypes.string.isRequired
    };

    onClick = () => {
        showChannelPage(this.props.id);
    }

    render() {
        const {name, icon, icon2x, linked} = this.props;

        return <div className='channel-item'
                    onClick={ this.onClick }>
                   <div className='channel-item-header'>
                       <img className='channel-item-icon'
                            src={ icon }
                            srcSet={ `${icon} 1x, ${icon2x} 2x` } />
                       <div className='channel-item-name'>
                           { name }
                       </div>
                       <div className='channel-item-right'>
                           { linked ? 'Open' : '>' }
                       </div>
                   </div>
               </div>;
    }
}


export class NotificationsSettingsComponent extends Component {
    static contextTypes = {
        ui: PropTypes.object
    };

    static propTypes = {
        appChannels: PropTypes.array.isRequired,
        user: PropTypes.object.isRequired
    };

    render() {
        const {ui: {text}} = this.context;
        const {appChannels, user} = this.props;

        if (!user._id) {
            return null;
        }

        const channels = getAppChannelDetails(appChannels).map(({channel, details}) => {
            return <ChannelItem key={ channel.type }
                                id={ channel.type }
                                {...details}
                                linked={ isChannelLinked(user.clients, channel.type) }
                                link={ details.getLink(user, channel) } />;
        });


        return <div className='settings-wrapper content-wrapper'>
                   <p className='settings-header'>
                       Cross-Channel Conversations
                   </p>
                   <p>
                       { text.notificationsSettingsText }
                   </p>
                   <div className='channels'>
                       { channels }
                   </div>
               </div>;
    }
}

export const NotificationsSettings = connect(({app, user}) => {
    return {
        appChannels: app.integrations,
        user
    };
})(NotificationsSettingsComponent);
