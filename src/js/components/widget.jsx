import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import isMobile from 'ismobilejs';
import debounce from 'lodash.debounce';

import { Header } from 'components/header';
import { Conversation } from 'components/conversation';
import { Settings } from 'components/settings';
import { Notification } from 'components/notification';
import { ErrorNotification } from 'components/error-notification';
import { ChatInput } from 'components/chat-input';
import { MessageIndicator } from 'components/message-indicator';

import { resetUnreadCount } from 'services/conversation-service';

export class WidgetComponent extends Component {
    onTouchStart = (e) => {
        resetUnreadCount();
        // the behavior is problematic only on iOS devices
        if (this.refs.input && isMobile.apple.device) {
            const component = this.refs.input.getWrappedInstance();
            const node = findDOMNode(component);

            // only blur if touching outside of the footer
            if (!node.contains(e.target)) {
                component.blur();
            }
        }
    };

    onClick = () => {
        resetUnreadCount();
    };

    onWheel = debounce(() => {
        resetUnreadCount();
    }, 250, {
        leading: true
    });

    render() {
        const settingsComponent = this.props.appState.settingsVisible ? <Settings /> : null;
        const footer = this.props.appState.settingsVisible ? null : <ChatInput ref='input' />;

        const classNames = [];

        if (this.props.appState.embedded) {
            classNames.push('sk-embedded');
        } else {
            // `widgetOpened` can have 3 values: `true`, `false`, and `undefined`.
            // `undefined` is basically the default state where the widget was never
            // opened or closed and not visibility class is applied to the widget
            if (this.props.appState.widgetOpened === true) {
                classNames.push('sk-appear');
            } else if (this.props.appState.widgetOpened === false) {
                classNames.push('sk-close');
            }
        }

        if (isMobile.apple.device) {
            classNames.push('sk-ios-device');
        }

        const className = classNames.join(' ');

        const notification = this.props.appState.errorNotificationMessage ?
            <ErrorNotification message={ this.props.appState.errorNotificationMessage } /> :
            this.props.appState.settingsNotificationVisible ?
                <Notification /> :
                null;

        return (
            <div id='sk-container'
                 className={ className }
                 onTouchStart={ this.onTouchStart }
                 onClick={ this.onClick }
                 onWheel={ this.onWheel }>
                <MessageIndicator />
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
