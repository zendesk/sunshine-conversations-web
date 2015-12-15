import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Header } from './header.jsx';
import { Conversation } from './conversation.jsx';
import { Settings } from './settings.jsx';
import { EmailNotification } from './notification.jsx';
import { ChatInput } from './chat-input.jsx';

class WidgetComponent extends Component {

    render() {
        const mainComponent = this.props.appState.settingsVisible ? <Settings /> : <Conversation />;
        const footer = this.props.appState.settingsVisible ? '' : (
            <ChatInput />
        );
        const notification = this.props.appState.settingsNotificationVisible ? <EmailNotification /> : '';

        let className = typeof this.props.appState.widgetOpened === "undefined" ? '' :
            this.props.appState.widgetOpened ? 'sk-appear' : 'sk-close'

        return (
            <div id="sk-container" className={className}>
                <div id="sk-wrapper">
                    <Header />
                    { notification }
                    { mainComponent }
                    { footer }
                </div>
            </div>
        )
    }
}

export const Widget = connect((state) => {
    return {
      appState: state.appState
    } 
})(WidgetComponent);
