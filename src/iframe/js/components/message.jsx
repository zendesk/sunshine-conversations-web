import isMobile from 'ismobilejs';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import { TextMessage } from './text-message';
import { ImageMessage } from './image-message';
import { Action } from './action';
import { findDOMNode } from 'react-dom';
import { getElementProperties } from '../utils/dom';
import { resendMessage } from '../services/conversation';
import { SEND_STATUS, GLOBAL_ACTION_TYPES } from '../constants/message';
import { LoadingComponent } from './loading';

class Message extends Component {
    static propTypes = {
        name: PropTypes.string,
        actions: PropTypes.array,
        type: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        mediaUrl: PropTypes.string,
        text: PropTypes.string,
        accentColor: PropTypes.string,
        linkColor: PropTypes.string,
        firstInGroup: PropTypes.bool,
        lastInGroup: PropTypes.bool,
        sendStatus: PropTypes.string,
        tapToRetryText: PropTypes.string.isRequired,
        clickToRetryText: PropTypes.string.isRequired,
        locationSendingFailedText: PropTypes.string.isRequired
    };

    static defaultProps = {
        actions: [],
        sendStatus: SEND_STATUS.SENT
    };

    componentDidMount() {
        if (this.props.actions.length === 0) {
            this._restyleBubble();
        }
    }

    _restyleBubble() {
        const bubble = findDOMNode(this.refs.messageContent);
        if (bubble) {
            const messageElement = bubble.firstChild;
            const messageProperties = getElementProperties(messageElement);
            const bubbleProperties = getElementProperties(bubble);
            const multiLineCheck = parseInt(bubbleProperties.fontSize) * 2;
            if (messageProperties.height > multiLineCheck && messageProperties.width < bubbleProperties.width) {
                bubble.style.width = (messageProperties.width + parseInt(bubbleProperties.paddingLeft) + parseInt(bubbleProperties.paddingRight)) + 'px';
            }
        }
    }

    onMessageClick() {
        const {sendStatus} = this.props;

        if (sendStatus === SEND_STATUS.FAILED) {
            this.props.dispatch(resendMessage(this.props._clientId));
        }
    }

    render() {
        const {name, role, avatarUrl, text, accentColor, firstInGroup, lastInGroup, linkColor, type, mediaUrl, sendStatus, clickToRetryText, tapToRetryText, locationSendingFailedText} = this.props;
        const actions = this.props.actions.filter(({type}) => !GLOBAL_ACTION_TYPES.includes(type));
        const hasText = text && text.trim() && text.trim() !== mediaUrl;
        const hasImage = type === 'image';
        const hasLocation = type === 'location';
        const isAppUser = role === 'appUser';
        const hasActions = actions.length > 0;
        const lastItem = hasActions ? 'actions' : hasText ? 'text' : hasLocation ? 'location' : null;

        const avatarClass = hasImage ? ['sk-msg-avatar', 'sk-msg-avatar-img'] : ['sk-msg-avatar'];
        const avatarPlaceHolder = isAppUser ? null : (<div className='sk-msg-avatar-placeholder' />);
        const containerClasses = ['sk-msg'];

        if (hasImage || actions.length > 0) {
            containerClasses.push('sk-msg-image');
        }

        const actionList = actions.map((action) => {
            return <Action key={ action._id }
                           buttonColor={ linkColor }
                           {...action} />;
        });

        const avatar = isAppUser ? null :
            <img alt={ `${name}'s avatar` }
                 className={ avatarClass.join(' ') }
                 src={ avatarUrl } />;

        const textClasses = ['sk-message-item', 'sk-message-text'];

        if (lastItem === 'text') {
            textClasses.push('sk-last-item');
        }

        const textPart = hasText && <TextMessage {...this.props}
                                                 className={ textClasses.join(' ') } />;
        const imagePart = hasImage && <ImageMessage {...this.props} />;

        const style = {};

        if (!hasImage || hasActions || hasText) {
            if (isAppUser && accentColor) {
                style.backgroundColor = style.borderLeftColor = `#${accentColor}`;
            }
        }

        const rowClass = ['sk-row'];

        if (isAppUser) {
            rowClass.push('sk-right-row');
        } else {
            rowClass.push('sk-left-row');
        }

        if (firstInGroup) {
            if (isAppUser) {
                rowClass.push('sk-row-appuser-first');
            } else {
                rowClass.push('sk-row-appmaker-first');
            }
        }

        if (lastInGroup) {
            if (isAppUser) {
                rowClass.push('sk-row-appuser-last');
            } else {
                rowClass.push('sk-row-appmaker-last');
            }
        }

        if (!firstInGroup && !lastInGroup) {
            if (isAppUser) {
                rowClass.push('sk-row-appuser-middle');
            } else {
                rowClass.push('sk-row-appmaker-middle');
            }
        }

        const fromName = <div className='sk-from'>
                             { isAppUser ? '' : name }
                         </div>;

        const actionListClasses = ['sk-message-item'];

        if (lastItem === 'actions') {
            actionListClasses.push('sk-last-item');
        }

        if ([SEND_STATUS.SENDING, SEND_STATUS.FAILED].includes(sendStatus)) {
            containerClasses.push('sk-msg-unsent');
        }

        const clickToRetry = <div className='sk-retry'>
                                 { isMobile.any ? tapToRetryText : clickToRetryText }
                             </div>;


        const locationClasses = ['sk-message-item'];

        if (lastItem === 'location') {
            locationClasses.push('sk-last-item');
        }

        if (sendStatus === SEND_STATUS.SENDING) {
            locationClasses.push('sk-message-location-loading');
        } else {
            locationClasses.push('sk-message-text');
        }

        let locationPart;

        if (type === 'location' && !textPart) {
            locationPart = sendStatus === SEND_STATUS.FAILED ?
                <TextMessage className={ locationClasses.join(' ') }
                             text={ locationSendingFailedText }
                             role={ role } />
                : <div className={ locationClasses.join(' ') }>
                      <LoadingComponent color={ !isAppUser ? accentColor : null } />
                  </div> ;
        }

        return <div className={ rowClass.join(' ') }>
                   { !isAppUser && firstInGroup ? fromName : null }
                   { lastInGroup ? avatar : avatarPlaceHolder }
                   <div className='sk-msg-wrapper'>
                       <div className={ containerClasses.join(' ') }
                            style={ style }
                            ref='messageContent'
                            onClick={ this.onMessageClick.bind(this) }>
                           { imagePart ? imagePart : null }
                           { textPart ? textPart : null }
                           { locationPart ? locationPart : null }
                           { hasActions ? <div className={ actionListClasses.join(' ') }>
                                              { actionList }
                                          </div> : null }
                       </div>
                       { sendStatus === SEND_STATUS.FAILED ? clickToRetry : null }
                   </div>
                   <div className='sk-clear'></div>
               </div>;
    }
}

export const MessageComponent = connect(({ui: {text}}) => {
    return {
        clickToRetryText: text.clickToRetry,
        tapToRetryText: text.tapToRetry,
        locationSendingFailedText: text.locationSendingFailed
    };
})(Message);
