import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';

import { getAppChannelDetails, hasChannels } from '../utils/app';
import { showChannelPage, showSettings } from '../actions/app-state';

export class ConnectNotificationComponent extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        appChannels: PropTypes.array.isRequired,
        config: PropTypes.object.isRequired,
        connectNotificationText: PropTypes.string.isRequired
    };

    bindHandler() {
        const {dispatch} = this.props;
        const node = findDOMNode(this);
        if (node) {
            const linkNode = node.querySelector('[data-ui-settings-link]');
            const {config: {style: {linkColor}}} = this.props;
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
        const {appChannels, connectNotificationText, config, dispatch} = this.props;
        const {style} = config;

        const isConnectNotification = hasChannels(config);

        if (isConnectNotification) {
            const linkStyle = style.linkColor ? {
                color: `#${style.linkColor}`
            } : null;


            const channels = getAppChannelDetails(appChannels)
                .filter(({details}) => details.isLinkable)
                .map(({channel, details}, index, array) => {
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

export default connect(({config, ui: {text}}) => {
    return {
        appChannels: config.integrations,
        connectNotificationText: text.connectNotificationText,
        config
    };
})(ConnectNotificationComponent);
