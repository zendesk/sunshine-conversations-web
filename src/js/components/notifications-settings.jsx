import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { showChannelPage } from '../services/app-service';
import { getAppChannelDetails } from '../utils/app';
import { isChannelLinked, getDisplayName } from '../utils/user';

export class ChannelItem extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        linked: PropTypes.bool.isRequired,
        hasURL: PropTypes.string,
        icon: PropTypes.string.isRequired,
        icon2x: PropTypes.string.isRequired,
        displayName: PropTypes.string
    };

    static contextTypes = {
        settings: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
    };

    onClick = () => {
        showChannelPage(this.props.id);
    };

    render() {
        const {name, icon, icon2x, linked, hasURL, displayName} = this.props;
        const {settings, ui: {text}} = this.context;

        const itemRightStyle = linked && settings.linkColor ? {
            color: `#${settings.linkColor}`
        } : null;

        const classNames = ['channel-item'];
        const contentClassNames = ['channel-item-content'];

        if (linked) {
            classNames.push('channel-item-linked');
            contentClassNames.push('linked');
        }

        return <div className={ classNames.join(' ') }
                    onClick={ this.onClick }>
                   <div className='channel-item-header'>
                       <img className='channel-item-icon'
                            src={ icon }
                            srcSet={ `${icon} 1x, ${icon2x} 2x` } />
                       <div className={ contentClassNames.join(' ') }>
                           <div className='channel-item-name'>
                               { name }
                           </div>
                           { linked ? <div className='channel-item-connected-as'>
                                          { text.notificationSettingsConnectedAs.replace('{username}', displayName) }
                                      </div> : null }
                       </div>
                       <div className='channel-item-right'
                            style={ itemRightStyle }>
                           { hasURL && linked ? 'Open' : <i className='fa fa-angle-right' /> }
                       </div>
                   </div>
               </div>;
    }
}


export class NotificationsSettingsComponent extends Component {
    static contextTypes = {
        ui: PropTypes.object.isRequired
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

        let channels = getAppChannelDetails(appChannels);
        channels.sort(({channel}) => {
            // List the linked channels first
            return isChannelLinked(user.clients, channel.type) ? -1 : 1;
        });

        channels = channels.map(({channel, details}) => {
            return <ChannelItem key={ channel.type }
                                id={ channel.type }
                                {...details}
                                displayName={ getDisplayName(user.clients, channel.type) }
                                linked={ isChannelLinked(user.clients, channel.type) }
                                hasURL={ details.getURL && details.getURL(user, channel) } />;
        });

        return <div className='content-wrapper'>
                   <div className='settings-wrapper'>
                       <p className='settings-header'>
                           { text.notificationSettingsChannelsTitle }
                       </p>
                       <p className='settings-description'>
                           { text.notificationSettingsChannelsDescription }
                       </p>
                       <div className='channels'>
                           { channels }
                       </div>
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
