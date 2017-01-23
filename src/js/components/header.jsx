import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';

import { toggleWidget, showSettings, hideSettings, hideChannelPage } from '../services/app';
import { hasChannels } from '../utils/app';
import { CHANNEL_DETAILS } from '../constants/channels';
import { WIDGET_STATE } from '../constants/app';

export class HeaderComponent extends Component {

    static propTypes = {
        appState: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        text: PropTypes.object.isRequired,
        unreadCount: PropTypes.number.isRequired
    };

    constructor(...args) {
        super(...args);
        bindAll(this,
            'showSettings',
            'hideSettings',
            'onClick'
        );
    }

    showSettings(e) {
        const {dispatch} = this.props;
        e.stopPropagation();
        dispatch(showSettings());
    }

    hideSettings(e) {
        e.stopPropagation();
        const {dispatch, appState: {visibleChannelType}} = this.props;
        if (visibleChannelType) {
            dispatch(hideChannelPage());
        } else {
            dispatch(hideSettings());
        }
    }

    onClick(e) {
        e.preventDefault();
        const {dispatch, appState: {embedded}} = this.props;
        if (!embedded) {
            dispatch(toggleWidget());
        }
    }

    render() {
        const {appState: {emailCaptureEnabled, settingsVisible, widgetState, embedded, visibleChannelType}, unreadCount, settings, text} = this.props;
        const {settingsHeaderText, headerText} = text;
        const {brandColor} = settings;

        const settingsMode = !!(settingsVisible || visibleChannelType);
        const showSettingsButton = (hasChannels(settings) || emailCaptureEnabled) && !settingsMode;
        const widgetOpened = widgetState === WIDGET_STATE.OPENED;

        const unreadBadge = !settingsMode && unreadCount > 0 ? (
            <div className='unread-badge'>
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
            closeHandle = widgetOpened ? <div className='sk-close-handle sk-close-hidden'>
                                             <i className='fa fa-times'></i>
                                         </div> : null;
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
                    onClick={ this.onClick }
                    className='sk-header-wrapper'
                    style={ style }>
                   { settingsButton }
                   { settingsMode ? settingsText : headerText }
                   { unreadBadge }
                   { closeHandle }
               </div>;
    }
}

function mapStateToProps({app, ui: {text}, appState: {emailCaptureEnabled, settingsVisible, widgetState, embedded, visibleChannelType}, conversation}) {
    return {
        appState: {
            emailCaptureEnabled,
            settingsVisible,
            widgetState,
            embedded,
            visibleChannelType
        },
        unreadCount: conversation.unreadCount,
        settings: app.settings.web,
        text
    };
}

export const Header = connect(mapStateToProps)(HeaderComponent);
