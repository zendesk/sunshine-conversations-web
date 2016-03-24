import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleWidget } from 'services/app-service';
import { showSettings, hideSettings } from 'actions/app-state-actions';

export class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.actions = this.props.actions;

        this.showSettings = this.showSettings.bind(this);
        this.hideSettings = this.hideSettings.bind(this);
    }

    showSettings(e) {
        e.stopPropagation();
        this.actions.showSettings();
    }

    hideSettings(e) {
        e.stopPropagation();
        this.actions.hideSettings();
    }

    render() {
        const {settingsEnabled, settingsVisible, widgetOpened, embedded} = this.props.appState;
        const {settingsHeaderText, headerText} = this.props.ui.text;

        const unreadMessagesCount = this.props.conversation.unreadCount;

        const unreadBadge = !settingsVisible && unreadMessagesCount > 0 ? (
            <div id='sk-badge'>
                { unreadMessagesCount }
            </div>
            ) : null;

        const settingsButton = widgetOpened && settingsEnabled && !settingsVisible ? (
            <div id='sk-settings-handle' onClick={ this.showSettings }>
                <i className='fa fa-gear'></i>
            </div>
            ) : null;

        const backButton = widgetOpened && settingsEnabled && settingsVisible ? (
            <div className='sk-back-handle' onClick={ this.hideSettings }>
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

        const settingsText = <div style={ settingsTextStyle } onClick={ this.hideSettings }>
                                 { settingsHeaderText }
                             </div>;

        return (
            <div id={ settingsVisible ? 'sk-settings-header' : 'sk-header' } onClick={ !embedded && toggleWidget }>
                { settingsButton }
                { backButton }
                { settingsVisible ? settingsText : headerText }
                { unreadBadge }
                { closeHandle }
            </div>
            );
    }
}

function mapStateToProps(state) {
    return {
        ui: state.ui,
        appState: state.appState,
        conversation: state.conversation
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            showSettings,
            hideSettings
        }, dispatch)
    };
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
