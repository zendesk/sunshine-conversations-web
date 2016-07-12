import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import isMobile from 'ismobilejs';
import debounce from 'lodash.debounce';

import { Badge } from './badge';
import { Header } from './header';
import { Conversation } from './conversation';
import { Settings } from './settings';
import { Channel } from './channels/channel';
import { ErrorNotification } from './error-notification';
import { ChatInput } from './chat-input';
import { MessageIndicator } from './message-indicator';

import { resetUnreadCount } from '../services/conversation-service';
import { hasChannels } from '../utils/app';
import { DISPLAY_STYLE } from '../constants/styles';

export class WidgetComponent extends Component {
    static propTypes = {
        smoochId: PropTypes.string,
        app: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired,
        appState: PropTypes.object.isRequired
    };

    static childContextTypes = {
        app: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        ui: PropTypes.object.isRequired
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

    onWheel = debounce(() => {
        resetUnreadCount();
    }, 250, {
        leading: true
    });

    getChildContext() {
        return {
            app: this.props.app,
            settings: this.props.settings,
            ui: this.props.ui
        };
    }

    render() {
        const {appState, settings, smoochId} = this.props;
        const {displayStyle, isBrandColorDark, isAccentColorDark, isLinkColorDark} = settings;

        const settingsComponent = appState.settingsVisible ? <Settings /> : null;

        // if no user set in store or the app has no channels,
        // no need to render the channel page manager
        const channelsComponent = smoochId && hasChannels(settings) ? <Channel /> : null;

        const footer = appState.settingsVisible ? null : <ChatInput ref='input' />;

        const classNames = [];

        if (appState.embedded) {
            classNames.push('sk-embedded');
        } else {
            // `widgetOpened` can have 3 values: `true`, `false`, and `undefined`.
            // `undefined` is basically the default state where the widget was never
            // opened or closed and not visibility class is applied to the widget
            if (appState.widgetOpened === true) {
                classNames.push('sk-appear');
            } else if (appState.widgetOpened === false) {
                classNames.push('sk-close');
            } else {
                classNames.push('sk-init');
            }
        }

        if (isMobile.apple.device) {
            classNames.push('sk-ios-device');
        }

        const notification = appState.errorNotificationMessage ?
            <ErrorNotification message={ appState.errorNotificationMessage } /> : null;

        const wrapperClassNames = [
            `sk-branding-color-${isBrandColorDark ? 'dark' : 'light'}`,
            `sk-accent-color-${isAccentColorDark ? 'dark' : 'light'}`,
            `sk-link-color-${isLinkColorDark ? 'dark' : 'light'}`
        ];

        let badge;

        if (displayStyle === DISPLAY_STYLE.BADGE) {
            badge = <Badge />;
        }

        return <div id='sk-container'
                    className={ classNames.join(' ') }
                    onTouchStart={ this.onTouchStart }
                    onClick={ this.onClick }
                    onWheel={ this.onWheel }>
                   <MessageIndicator />
                   { badge }
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
               </div>;
    }
}

export const Widget = connect(({appState: {settingsVisible, widgetOpened, errorNotificationMessage, embedded}, app, ui, user}) => {
    // only extract what is needed from appState as this is something that might
    // mutate a lot
    return {
        appState: {
            settingsVisible,
            widgetOpened,
            errorNotificationMessage,
            embedded
        },
        app,
        settings: app.settings.web,
        ui,
        smoochId: user._id
    };
})(WidgetComponent);
