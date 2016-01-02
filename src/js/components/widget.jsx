import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Header } from 'components/header.jsx';
import { Conversation } from 'components/conversation.jsx';
import { Settings } from 'components/settings.jsx';
import { Notification } from 'components/notification.jsx';
import { ChatInput } from 'components/chat-input.jsx';

export class WidgetComponent extends Component {

    render() {
        const mainComponent = this.props.appState.settingsVisible ? <Settings /> : <Conversation />;
        const footer = this.props.appState.settingsVisible ? null : <ChatInput />;

        let className = typeof this.props.appState.widgetOpened === 'undefined' ? '' :
            this.props.appState.widgetOpened ? 'sk-appear' : 'sk-close'

        return (
            <div id="sk-container" className={ className }>
                <div id="sk-wrapper">
                    <Header />
                    <Notification />
                    { mainComponent }
                    { footer }
                </div>
            </div>
            );
    }
}

export const Widget = connect((state) => {
    return {
        appState: state.appState
    }
})(WidgetComponent);
