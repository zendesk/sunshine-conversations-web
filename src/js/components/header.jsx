import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleWidget, showSettings, hideSettings } from 'actions/app-state-actions';

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
        let {settingsEnabled, settingsVisible, widgetOpened} = this.props.appState;
        let {settingsHeaderText, headerText} = this.props.ui.text;

        let unreadTimestamp = this.props.appState.messageReadTimestamp;

        let unreadMessagesCount = unreadTimestamp <= 0 ? 0 : this.props.conversation.messages.reduce((count, message) => {
            if (message.role !== 'appUser' && unreadTimestamp <= message.received) {
                return count + 1;
            }
            return count;
        }, 0);

        let unreadBadge = !settingsVisible && unreadMessagesCount > 0 ? (
            <div id="sk-badge">
                { unreadMessagesCount }
            </div>
            ) : null;

        const settingsButton = widgetOpened && settingsEnabled && !settingsVisible ? (
            <div id="sk-notification-badge" onClick={ this.showSettings }>
                <i className="fa fa-gear"></i>
            </div>
            ) : null;

        const backButton = widgetOpened && settingsEnabled && settingsVisible ? (
            <div className="sk-back-handle" onClick={ this.hideSettings }>
                <i className="fa fa-arrow-left"></i>
            </div>
            ) : null;

        const closeHandle = widgetOpened ? (
            <div className="sk-close-handle sk-close-hidden">
                <i className="fa fa-times"></i>
            </div>
            ) : (
            <div className="sk-show-handle sk-appear-hidden">
                <i className="fa fa-arrow-up"></i>
            </div>
            );

        return (
            <div id={ settingsVisible ? 'sk-settings-header' : 'sk-header' } onClick={ this.actions.toggleWidget }>
                { settingsButton }
                { backButton }
                { settingsVisible ? settingsHeaderText : headerText }
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
            toggleWidget,
            showSettings,
            hideSettings
        }, dispatch)
    };
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
