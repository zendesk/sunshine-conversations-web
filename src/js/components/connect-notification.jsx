import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

import { getAppChannelDetails, hasChannels } from '../utils/app';
import { createMarkup } from '../utils/html';
import { showChannelPage, showSettings } from '../services/app-service';

export class ConnectNotificationComponent extends Component {
    static propTypes = {
        appChannels: PropTypes.array.isRequired,
        emailCaptureEnabled: PropTypes.bool.isRequired
    };

    static contextTypes = {
        ui: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired
    };

    bindHandler() {
        const node = findDOMNode(this);
        if (node) {
            const linkNode = node.querySelector('[data-ui-settings-link]');
            const {settings: {linkColor}} = this.context;
            if (linkNode) {
                linkNode.onclick = (e) => {
                    e.preventDefault();
                    showSettings();
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
        const {ui: {text: {connectNotificationText, settingsNotificationText}}, settings} = this.context;
        const {appChannels, emailCaptureEnabled} = this.props;

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
                        showChannelPage(channel.type);
                    };

                    const separator = index !== array.length - 1 ? ',' : '';

                    return <div style={ linkStyle }
                                className='channel-details'
                                key={channel.type}>
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

        if (emailCaptureEnabled) {
            return <div className='connect-notification'>
                       <span ref='text'
                             dangerouslySetInnerHTML={ createMarkup(settingsNotificationText) }></span>
                   </div>;
        }

        return null;
    }
}

export const ConnectNotification = connect(({app, appState}) => {
    return {
        appChannels: app.integrations,
        emailCaptureEnabled: appState.emailCaptureEnabled
    };
})(ConnectNotificationComponent);
