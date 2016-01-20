import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { Header } from 'components/header';
import { Conversation } from 'components/conversation';
import { Settings } from 'components/settings';
import { Notification } from 'components/notification';
import { ErrorNotification } from 'components/error-notification';
import { ChatInput } from 'components/chat-input';

export class WidgetComponent extends Component {

    render() {
        const settingsComponent = this.props.appState.settingsVisible ? <Settings /> : null;
        const footer = this.props.appState.settingsVisible ? null : <ChatInput />;

        // We check for `undefined` explicitely because it means the widget is in it's default state
        // It was never opened nor closed. `sk-appear` and `sk-close` expect to be in one or the other state
        // for their animations. The animation can go from undefined to `sk-appear`, `sk-appear` to `sk-close`, and
        // `sk-close` to `sk-appear`. If it starts with `sk-close`, it starts by being opened and animates to close state.
        let className = this.props.appState.widgetOpened === null ? '' :
            this.props.appState.widgetOpened ? 'sk-appear' : 'sk-close';

        let notification = this.props.appState.errorNotificationMessage ?
            <ErrorNotification message={ this.props.appState.errorNotificationMessage } /> :
            this.props.appState.settingsNotificationVisible ?
                <Notification /> :
                null;

        return (
            <div id='sk-container' className={ className }>
                <div id='sk-wrapper'>
                    <Header />
                    <ReactCSSTransitionGroup component='div'
                                             className='sk-notification-container'
                                             transitionName='sk-notification'
                                             transitionAppear={ true }
                                             transitionAppearTimeout={ 500 }
                                             transitionEnterTimeout={ 500 }
                                             transitionLeaveTimeout={ 500 }>
                        { notification }
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup component='div'
                                             transitionName='settings'
                                             transitionAppear={ true }
                                             transitionAppearTimeout={ 250 }
                                             transitionEnterTimeout={ 250 }
                                             transitionLeaveTimeout={ 250 }>
                        { settingsComponent }
                    </ReactCSSTransitionGroup>
                    <Conversation />
                    { footer }
                </div>
            </div>
            );
    }
}

export const Widget = connect((state) => {
    return {
        appState: state.appState
    };
})(WidgetComponent);
