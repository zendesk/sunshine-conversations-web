import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

import TextMessage from './TextMessage';
import ImageMessage from './ImageMessage';
import Action from './Action';
import Loading from './Loading';

import { getElementProperties } from '../utils/dom';
import { resendMessage } from '../actions/conversation';
import { SEND_STATUS, GLOBAL_ACTION_TYPES } from '../constants/message';

class MessageComponent extends Component {
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
        const bubble = this._messageContent;
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
        const hasFile = type === 'file';
        const hasImage = type === 'image';
        const hasLocation = type === 'location';
        const isAppUser = role === 'appUser';
        const hasActions = actions.length > 0;

        let lastItem;

        if (hasActions) {
            lastItem = 'actions';
        } else if (hasText || hasFile) {
            lastItem = 'text';
        } else if (hasLocation) {
            lastItem = 'location';
        }

        const avatarClass = hasImage ? ['msg-avatar', 'msg-avatar-img'] : ['msg-avatar'];
        const avatarPlaceHolder = isAppUser ? null : <div className='msg-avatar-placeholder' />;
        const containerClasses = ['msg'];

        if (hasImage || actions.length > 0) {
            containerClasses.push('msg-image');
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

        const textClasses = ['message-item', 'message-text'];

        if (lastItem === 'text') {
            textClasses.push('last-item');
        }

        const textPart = (hasText || hasFile) && <TextMessage {...this.props}
                                                              className={ textClasses.join(' ') } />;
        const imagePart = hasImage && <ImageMessage {...this.props} />;

        const style = {};

        if (!hasImage || hasActions || hasText) {
            if (isAppUser && accentColor) {
                style.backgroundColor = style.borderLeftColor = `#${accentColor}`;
            }
        }

        const rowClass = ['row'];

        if (isAppUser) {
            rowClass.push('right-row');
        } else {
            rowClass.push('left-row');
        }

        if (firstInGroup) {
            if (isAppUser) {
                rowClass.push('row-appuser-first');
            } else {
                rowClass.push('row-appmaker-first');
            }
        }

        if (lastInGroup) {
            if (isAppUser) {
                rowClass.push('row-appuser-last');
            } else {
                rowClass.push('row-appmaker-last');
            }
        }

        if (!firstInGroup && !lastInGroup) {
            if (isAppUser) {
                rowClass.push('row-appuser-middle');
            } else {
                rowClass.push('row-appmaker-middle');
            }
        }

        const fromName = <div className='from'>
                             { isAppUser ? '' : name }
                         </div>;

        const actionListClasses = ['message-item'];

        if (lastItem === 'actions') {
            actionListClasses.push('last-item');
        }

        if ([SEND_STATUS.SENDING, SEND_STATUS.FAILED].includes(sendStatus)) {
            containerClasses.push('msg-unsent');
        }

        const clickToRetry = <div className='retry'>
                                 { isMobile.any ? tapToRetryText : clickToRetryText }
                             </div>;


        const locationClasses = ['message-item'];

        if (lastItem === 'location') {
            locationClasses.push('last-item');
        }

        if (sendStatus === SEND_STATUS.SENDING) {
            locationClasses.push('message-location-loading');
        } else {
            locationClasses.push('message-text');
        }

        let locationPart;

        if (type === 'location' && !textPart) {
            locationPart = sendStatus === SEND_STATUS.FAILED ?
                <TextMessage className={ locationClasses.join(' ') }
                             text={ locationSendingFailedText }
                             role={ role } />
                : <div className={ locationClasses.join(' ') }>
                      <Loading color={ !isAppUser ? accentColor : null } />
                  </div> ;
        }

        return <div className={ rowClass.join(' ') }>
                   { !isAppUser && firstInGroup ? fromName : null }
                   <div className='msg-wrapper'>
                       { lastInGroup ? avatar : avatarPlaceHolder }
                       <div className={ containerClasses.join(' ') }
                            style={ style }
                            ref={ (c) => this._messageContent = c }
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
                   <div className='clear'></div>
               </div>;
    }
}

export default connect(({ui: {text}}) => {
    return {
        clickToRetryText: text.clickToRetry,
        tapToRetryText: text.tapToRetry,
        locationSendingFailedText: text.locationSendingFailed
    };
})(MessageComponent);
