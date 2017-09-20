import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import isMobile from 'ismobilejs';

import { MessengerButton } from './messenger-button';
import { Header } from './header';
import { Conversation } from './conversation';
import { Settings } from './settings';
import { Channel } from './channels/channel';
import { ErrorNotification } from './error-notification';
import { ChatInput } from './chat-input';
import { MessageIndicator } from './message-indicator';

import { resetUnreadCount } from '../services/conversation';
import { hasChannels } from '../utils/app';
import { DISPLAY_STYLE } from '../constants/styles';
import { WIDGET_STATE } from '../constants/app';
import { disableAnimation } from '../actions/app-state-actions';

export class WidgetComponent extends Component {
    static propTypes = {
        smoochId: PropTypes.string,
        app: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired,
        appState: PropTypes.object.isRequired
    };

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

    handleResize = () => {
        this.props.dispatch(disableAnimation());
    };

    componentDidMount = () => {
        window.addEventListener('resize', this.handleResize);
    };

    componentWillUnmount = () => {
        window.removeEventListener('resize', this.handleResize);
    };

    render() {
        const {appState, settings, smoochId} = this.props;
        const {displayStyle, isBrandColorDark, isAccentColorDark, isLinkColorDark} = settings;

        const settingsComponent = appState.settingsVisible ? <Settings /> : null;

        // if no user set in store or the app has no channels,
        // no need to render the channel page manager
        const channelsComponent = smoochId && hasChannels(settings) ? <Channel /> : null;

        const footer = appState.settingsVisible ? null : <ChatInput ref='input' />;

        const classNames = [
            `sk-${displayStyle}-display`
        ];

        if (appState.embedded) {
            classNames.push('sk-embedded');
        } else {
            if (appState.widgetState === WIDGET_STATE.OPENED) {
                classNames.push('sk-appear');
            } else if (appState.widgetState === WIDGET_STATE.CLOSED) {
                classNames.push('sk-close');
            } else {
                // state is WIDGET_STATE.INIT
                classNames.push('sk-init');
            }
        }

        if (isMobile.apple.device) {
            classNames.push('sk-ios-device');
        }

        if (appState.showAnimation) {
            classNames.push('sk-animation');
        }

        const notification = appState.errorNotificationMessage ?
            <ErrorNotification message={ appState.errorNotificationMessage } /> : null;

        const wrapperClassNames = [
            `sk-branding-color-${isBrandColorDark ? 'dark' : 'light'}`,
            `sk-accent-color-${isAccentColorDark ? 'dark' : 'light'}`,
            `sk-link-color-${isLinkColorDark ? 'dark' : 'light'}`
        ];

        let messengerButton;

        if (displayStyle === DISPLAY_STYLE.BUTTON && !appState.embedded) {
            messengerButton = (
                <MessengerButton
                    shown={true}
                    isWidgetOpen={appState.widgetState === WIDGET_STATE.OPENED}
                />
            );
        }

        return <div>
                   <div id='sk-container'
                        className={ classNames.join(' ') }
                        onTouchStart={ this.onTouchStart }
                        onClick={ this.onClick }>
                       <MessageIndicator />
                       <div id='sk-wrapper'
                            className={ wrapperClassNames.join(' ') }>
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
                           { channelsComponent }
                           <Conversation />
                           { footer }
                       </div>
                   </div>
                   { messengerButton }
               </div>;
    }
}

export const Widget = connect(({appState: {settingsVisible, widgetState, errorNotificationMessage, embedded, showAnimation}, app, ui, user}) => {
    // only extract what is needed from appState as this is something that might
    // mutate a lot
    return {
        appState: {
            settingsVisible,
            widgetState,
            errorNotificationMessage,
            embedded,
            showAnimation
        },
        app,
        settings: app.settings.web,
        ui,
        smoochId: user._id
    };
})(WidgetComponent);
