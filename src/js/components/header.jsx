import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { toggleWidget, showSettings, hideSettings, hideChannelPage } from '../services/app-service';

export class HeaderComponent extends Component {

    static contextTypes = {
        ui: PropTypes.object
    }

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
        const {appState: {settingsEnabled, settingsVisible, widgetOpened, embedded, visibleChannelType}, unreadCount} = this.props;
        const {ui} = this.context;
        const {settingsHeaderText, headerText} = ui.text;

        const settingsMode = !!(settingsVisible || visibleChannelType);

        const unreadBadge = !settingsMode && unreadCount > 0 ? (
            <div id='sk-badge'>
                { unreadCount }
            </div>
            ) : null;

        const settingsButton = widgetOpened && settingsEnabled && !settingsMode ? (
            <div id='sk-settings-handle'
                 onClick={ this.showSettings }>
                <i className='fa fa-ellipsis-h'></i>
            </div>
            ) : null;

        const backButton = widgetOpened && settingsEnabled && settingsMode ? (
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

        const settingsText = <div style={ settingsTextStyle }
                                  onClick={ this.hideSettings }>
                                 { settingsHeaderText }
                             </div>;

        return (
            <div id={ settingsMode ? 'sk-settings-header' : 'sk-header' }
                 onClick={ !embedded && toggleWidget }
                 className='sk-header-wrapper'>
                { settingsButton }
                { backButton }
                { settingsMode ? settingsText : headerText }
                { unreadBadge }
                { closeHandle }
            </div>
            );
    }
}

function mapStateToProps({appState, conversation}) {
    return {
        appState,
        unreadCount: conversation.unreadCount
    };
}

export const Header = connect(mapStateToProps)(HeaderComponent);
