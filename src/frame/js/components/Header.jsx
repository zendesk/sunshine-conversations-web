import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleWidget, showSettings, hideSettings, hideChannelPage } from '../actions/app-state';
import { hasChannels } from '../utils/app';
import { bindAll } from '../utils/functions';
import { CHANNEL_DETAILS } from '../constants/channels';
import { WIDGET_STATE } from '../constants/app';

export class HeaderComponent extends Component {

    static propTypes = {
        appState: PropTypes.object.isRequired,
        config: PropTypes.object.isRequired,
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
        const {dispatch, appState: {widgetState}} = this.props;
        if (widgetState !== WIDGET_STATE.EMBEDDED) {
            dispatch(toggleWidget());
        }
    }

    render() {
        const {appState: {settingsVisible, widgetState, visibleChannelType}, unreadCount, config, text} = this.props;
        const {settingsHeaderText, headerText} = text;
        const {brandColor} = config.style;

        const settingsMode = !!(settingsVisible || visibleChannelType);
        const showSettingsButton = hasChannels(config) && !settingsMode;
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

        const backButton = settingsMode ? (
            <div className='sk-back-handle'
                 onClick={ this.hideSettings }>
                <i className='fa fa-arrow-left'></i>
            </div>
            ) : null;
        const closeHandle = widgetOpened && <div className='sk-close-handle sk-close-hidden'>
                                                <i className='fa fa-times'></i>
                                            </div>;

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

function mapStateToProps({config, ui: {text}, appState: {settingsVisible, widgetState, visibleChannelType}, conversation}) {
    return {
        appState: {
            settingsVisible,
            widgetState,
            visibleChannelType
        },
        unreadCount: conversation.unreadCount,
        config,
        text
    };
}

export default connect(mapStateToProps)(HeaderComponent);
