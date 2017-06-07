import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import isMobile from 'ismobilejs';

import { MessengerButton } from './messenger-button';

import { resetUnreadCount } from '../services/conversation';
import { hasChannels } from '../utils/app';
import { DISPLAY_STYLE } from '../constants/styles';
import { WIDGET_STATE } from '../constants/app';
import { disableAnimation } from '../actions/app-state-actions';

let Header;
let Conversation;
let Settings;
let Channel;
let ErrorNotification;
let ChatInput;
let MessageIndicator;

export class WidgetComponent extends Component {
    static propTypes = {
        smoochId: PropTypes.string,
        app: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        widgetSize: PropTypes.string.isRequired,
        appState: PropTypes.object.isRequired
    };

    state = {
        hasComponents: this.hasComponents()
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

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillMount() {
        if(this.shouldLoadComponents()) {
            this.loadComponents();
        }
    }

    componentWillUpdate(nextProps){
        if(this.shouldLoadComponents(nextProps)) {
            this.loadComponents();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    shouldLoadComponents(props = this.props) {
        if(this.hasComponents()) {
            return false;
        }

        const {appState, settings: {displayStyle}} = props;

        if(displayStyle === DISPLAY_STYLE.TAB || appState.widgetState === WIDGET_STATE.EMBEDDED) {
            return true;
        }

        if(displayStyle === DISPLAY_STYLE.BUTTON && appState.widgetState === WIDGET_STATE.OPENED) {
            return true;
        }

        return false;
    }

    hasComponents() {
        return Header && Conversation && Settings && Channel && ErrorNotification && ChatInput && MessageIndicator;
    }

    loadComponents() {
        Promise.all([
            import('./header'),
            import('./conversation'),
            import('./settings'),
            import('./channels/channel'),
            import('./error-notification'),
            import('./chat-input'),
            import('./message-indicator')
        ]).then(([
            HeaderModule,
            ConversationModule,
            SettingsModule,
            ChannelModule,
            ErrorNotificationModule,
            ChatInputModule,
            MessageIndicatorModule
        ]) => {
            Header = HeaderModule.Header;
            Conversation = ConversationModule.Conversation;
            Settings = SettingsModule.Settings;
            Channel = ChannelModule.Channel;
            ErrorNotification = ErrorNotificationModule.ErrorNotification;
            ChatInput = ChatInputModule.ChatInput;
            MessageIndicator = MessageIndicatorModule.MessageIndicator;

            this.setState({hasComponents: true});
        });
    }

    renderContent() {
        const {appState, settings, smoochId} = this.props;
        const {displayStyle, isBrandColorDark, isAccentColorDark, isLinkColorDark} = settings;

        const settingsComponent = appState.settingsVisible
            ? <Settings/>
            : null;

        // if no user set in store or the app has no channels,
        // no need to render the channel page manager
        const channelsComponent = smoochId && hasChannels(settings)
            ? <Channel/>
            : null;

        const footer = appState.settingsVisible
            ? null
            : <ChatInput ref='input' />;

        const classNames = [`sk-${displayStyle}-display`];

        if (appState.widgetState === WIDGET_STATE.OPENED) {
            classNames.push('sk-appear');
        } else if (appState.widgetState === WIDGET_STATE.CLOSED) {
            classNames.push('sk-close');
        } else if (appState.widgetState === WIDGET_STATE.EMBEDDED) {
            classNames.push('sk-embedded');
        } else {
            // state is WIDGET_STATE.INIT
            classNames.push('sk-init');
        }

        if (isMobile.apple.device) {
            classNames.push('sk-ios-device');
        }

        if (appState.showAnimation) {
            classNames.push('sk-animation');
        }

        const notification = appState.errorNotificationMessage
            ? <ErrorNotification message={ appState.errorNotificationMessage } />
            : null;

        const wrapperClassNames = [
            `sk-branding-color-${isBrandColorDark
                ? 'dark'
                : 'light'}`,
            `sk-accent-color-${isAccentColorDark
                ? 'dark'
                : 'light'}`,
            `sk-link-color-${isLinkColorDark
                ? 'dark'
                : 'light'}`
        ];

        return <div id='sk-container'
                    className={ classNames.join(' ') }
                    onTouchStart={ this.onTouchStart }
                    onClick={ this.onClick }>
                   <MessageIndicator/>
                   <div id='sk-wrapper'
                        className={ wrapperClassNames.join(' ') }>
                       <Header/>
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
                       <Conversation/>
                       { footer }
                   </div>
               </div>;
    }

    render() {
        const {appState, widgetSize, settings} = this.props;
        const {displayStyle} = settings;
        const {hasComponents} = this.state;

        let messengerButton;

        if (displayStyle === DISPLAY_STYLE.BUTTON && appState.widgetState !== WIDGET_STATE.EMBEDDED) {
            messengerButton = <MessengerButton shown={ appState.widgetState !== WIDGET_STATE.OPENED } />;
        }

        return <div className={ `widget-${widgetSize}` }>
                   { hasComponents && this.renderContent() }
                   { messengerButton }
               </div>;
    }
}

export const Widget = connect(({appState: {settingsVisible, widgetState, errorNotificationMessage, showAnimation, widgetSize}, app, user}) => {
    // only extract what is needed from appState as this is something that might
    // mutate a lot
    return {
        appState: {
            settingsVisible,
            widgetState,
            errorNotificationMessage,
            showAnimation
        },
        app,
        settings: app.settings.web,
        widgetSize,
        smoochId: user._id
    };
})(WidgetComponent);
