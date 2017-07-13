import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

import { getAppChannelDetails, hasChannels } from '../utils/app';
import { showChannelPage, showSettings } from '../services/app';

export class ConnectNotificationComponent extends Component {
    static propTypes = {
        appChannels: PropTypes.array.isRequired,
        settings: PropTypes.object.isRequired,
        connectNotificationText: PropTypes.string.isRequired
    };

    bindHandler() {
        const {dispatch} = this.props;
        const node = findDOMNode(this);
        if (node) {
            const linkNode = node.querySelector('[data-ui-settings-link]');
            const {settings: {linkColor}} = this.props;
            if (linkNode) {
                linkNode.onclick = (e) => {
                    e.preventDefault();
                    dispatch(showSettings());
                };

                if (linkColor) {
                    linkNode.style = `color: #${linkColor}`;
                }
            }
        }
    }

    componentDidMount() {
        this.bindHandler();
    }

    componentDidUpdate() {
        this.bindHandler();
    }

    render() {
        const {appChannels, connectNotificationText, settings, dispatch} = this.props;

        const isConnectNotification = hasChannels(settings);

        if (isConnectNotification) {
            const linkStyle = settings.linkColor ? {
                color: `#${settings.linkColor}`
            } : null;


            const channels = getAppChannelDetails(appChannels)
                .filter(({details}) => details.isLinkable)
                .map(({channel, details} , index, array) => {
                    const onClick = (e) => {
                        e.preventDefault();
                        dispatch(showChannelPage(channel.type));
                    };

                    const separator = index !== array.length - 1 ? ',' : '';

                    return <div style={ linkStyle }
                                className='channel-details'
                                key={ channel.type }>
                               <a style={ linkStyle }
                                  href
                                  className='channel-link'
                                  onClick={ onClick }>
                                   { details.name }
                               </a>
                               { separator }
                           </div>;
                });

            return <div className='connect-notification'>
                       <p>
                           { connectNotificationText }
                       </p>
                       <div className='connect-notification-channels'>
                           { channels }
                       </div>
                   </div>;
        }

        return null;
    }
}

export default connect(({app, ui: {text}}) => {
    return {
        appChannels: app.integrations,
        connectNotificationText: text.connectNotificationText,
        settings: app.settings.web
    };
})(ConnectNotificationComponent);
