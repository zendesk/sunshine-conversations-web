import React, { Component, PropTypes } from 'react';

import { TextMessage } from './text-message';
import { ImageMessage } from './image-message';
import { Action } from './action';
import { findDOMNode } from 'react-dom';
import { getElementProperties } from '../utils/dom';

export class MessageComponent extends Component {
    static propTypes = {
        name: PropTypes.string,
        actions: PropTypes.array,
        role: PropTypes.string.isRequired,
        mediaUrl: PropTypes.string,
        text: PropTypes.string,
        accentColor: PropTypes.string,
        linkColor: PropTypes.string,
        firstInGroup: PropTypes.bool,
        lastInGroup: PropTypes.bool
    };

    static defaultProps = {
        actions: []
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

    render() {
        const {name, role, avatarUrl, text, accentColor, firstInGroup, lastInGroup, linkColor, type} = this.props;
        const actions = this.props.actions.filter((a) => a.type !== 'reply');

        const hasText = text && text.trim();
        const hasImage = type === 'image';
        const isAppUser = role === 'appUser';
        const hasActions = actions.length > 0;
        const lastItem = hasActions ? 'actions' : hasText ? 'text' : null;

        const avatarClass = hasImage ? ['sk-msg-avatar', 'sk-msg-avatar-img'] : ['sk-msg-avatar'];
        const avatarPlaceHolder = isAppUser ? null : (<div className='sk-msg-avatar-placeholder' />);
        const containerClass = ['sk-msg'];

        if (hasImage || actions.length > 0) {
            containerClass.push('sk-msg-image');
        }

        const actionList = actions.map((action) => {
            return <Action key={ action._id }
                           buttonColor={ linkColor }
                           {...action} />;
        });

        const avatar = isAppUser ? null :
            <img className={ avatarClass.join(' ') }
                 src={ avatarUrl } />;

        const textClasses = ['sk-message-item', 'sk-message-text'];

        if (lastItem === 'text') {
            textClasses.push('sk-last-item');
        }

        const textPart = hasText && <TextMessage {...this.props}
                                                 className={ textClasses.join(' ') } />;
        const imagePart = hasImage && <ImageMessage {...this.props} />;

        const style = {};

        if (!hasImage) {
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

        if (firstInGroup && !lastInGroup) {
            if (isAppUser) {
                rowClass.push('sk-row-appuser-first');
            } else {
                rowClass.push('sk-row-appmaker-first');
            }
        }

        if (lastInGroup && !firstInGroup) {
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

        return <div className={ rowClass.join(' ') }>
                   { !isAppUser && firstInGroup ? fromName : null }
                   { lastInGroup ? avatar : avatarPlaceHolder }
                   <div className='sk-msg-wrapper'>
                       <div className={ containerClass.join(' ') }
                            style={ style }
                            ref='messageContent'>
                           { imagePart ? imagePart : null }
                           { textPart ? textPart : null }
                           { hasActions ? <div className={ actionListClasses.join(' ') }>
                                              { actionList }
                                          </div> : null }
                       </div>
                   </div>
                   <div className='sk-clear'></div>
               </div>;
    }
}
