import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { toggleWidget, showSettings, hideSettings, hideChannelPage } from '../services/app-service';
import { hasChannels } from '../utils/app';
import { CHANNEL_DETAILS } from '../constants/channels';

export class HeaderComponent extends Component {

    static contextTypes = {
        ui: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired
    };

    showSettings(e) {
        e.stopPropagation();
        showSettings();
    }

    hideSettings = (e) => {
        e.stopPropagation();
        const {visibleChannelType} = this.props.appState;
        if (visibleChannelType) {
            hideChannelPage();
        } else {
            hideSettings();
        }
    }

    render() {
        const {appState: {emailCaptureEnabled, settingsVisible, widgetOpened, embedded, visibleChannelType}, unreadCount} = this.props;
        const {ui, settings} = this.context;
        const {settingsHeaderText, headerText} = ui.text;
        const {brandColor} = settings;

        const settingsMode = !!(settingsVisible || visibleChannelType);
        const showSettingsButton = (hasChannels(settings) || emailCaptureEnabled) && !settingsMode;

        const unreadBadge = !settingsMode && unreadCount > 0 ? (
            <div id='sk-badge'>
                { unreadCount }
            </div>
            ) : null;

        const settingsButton = showSettingsButton ? (
            <div id='sk-settings-handle'
                 onClick={ this.showSettings }>
                <i className='fa fa-ellipsis-h'></i>
            </div>
            ) : null;

        const backButton = widgetOpened && settingsMode ? (
            <div className='sk-back-handle'
                 onClick={ this.hideSettings }>
                <i className='fa fa-arrow-left'></i>
            </div>
            ) : null;

        let closeHandle = null;
        if (!embedded) {
            closeHandle = widgetOpened ? (
                <div className='sk-close-handle sk-close-hidden'>
                    <i className='fa fa-times'></i>
                </div>
                ) : (
                <div className='sk-show-handle sk-appear-hidden'>
                    <i className='fa fa-arrow-up'></i>
                </div>
                );
        }

        const settingsTextStyle = {
            display: 'inline-block',
            height: 30,
            cursor: 'pointer'
        };

        const settingsText = <div className='settings-content'
                                  onClick={ this.hideSettings }>
                                 <div style={ settingsTextStyle }>
                                     { backButton }
                                     { visibleChannelType ? CHANNEL_DETAILS[visibleChannelType].name : settingsHeaderText }
                                 </div>
                             </div>;

        let style;
        if (brandColor) {
            style = {
                backgroundColor: `#${brandColor}`
            };
        }

        return <div id={ settingsMode ? 'sk-settings-header' : 'sk-header' }
                 onClick={ !embedded && toggleWidget }
                 className='sk-header-wrapper'
                 style={ style }>
                { settingsButton }
                { settingsMode ? settingsText : headerText }
                { unreadBadge }
                { closeHandle }
            </div>;
    }
}

function mapStateToProps({appState: {emailCaptureEnabled, settingsVisible, widgetOpened, embedded, visibleChannelType}, conversation}) {
    return {
        appState: {
            emailCaptureEnabled,
            settingsVisible,
            widgetOpened,
            embedded,
            visibleChannelType
        },
        unreadCount: conversation.unreadCount
    };
}

export const Header = connect(mapStateToProps)(HeaderComponent);
