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

        // We check for `undefined` explicitely because it means the widget is in it's default state
        // It was never opened nor closed. `sk-appear` and `sk-close` expect to be in one or the other state
        // for their animations. The animation can go from undefined to `sk-appear`, `sk-appear` to `sk-close`, and
        // `sk-close` to `sk-appear`. If it starts with `sk-close`, it starts by being opened and animates to close state.
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
