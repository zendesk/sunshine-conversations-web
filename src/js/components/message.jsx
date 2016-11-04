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
        const {name, role, mediaUrl, avatarUrl, text, accentColor, firstInGroup, lastInGroup, linkColor} = this.props;
        const actions = this.props.actions.filter((a) => a.type !== 'reply');

        const actionList = actions.map((action) => {
            return <Action key={ action._id }
                           buttonColor={ linkColor }
                           {...action} />;
        });

        const isAppUser = role === 'appUser';

        const avatarClass = mediaUrl ? ['sk-msg-avatar', 'sk-msg-avatar-img'] : ['sk-msg-avatar'];

        const avatar = isAppUser ?
            null :
            <img className={ avatarClass.join(' ') }
                 src={ avatarUrl } />;

        const avatarPlaceHolder = isAppUser ? null : (<div className='sk-msg-avatar-placeholder' />);

        const message = mediaUrl ?
            <ImageMessage {...this.props}
                          actions={ actions } /> :
            <TextMessage {...this.props}
                         actions={ actions } />;

        const containerClass = [mediaUrl ? 'sk-msg-image' : 'sk-msg'];

        const hasContent = (text && text.trim()) || (mediaUrl && mediaUrl.trim());

        if (hasContent && actions.length > 0) {
            containerClass.push('has-actions');
        }

        const style = {};

        if (!mediaUrl) {
            if (isAppUser && accentColor) {
                style.backgroundColor = style.borderLeftColor = `#${accentColor}`;
            }
        }
        if (firstInGroup && !lastInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-first');
            } else {
                containerClass.push('sk-msg-appmaker-first');
            }
        }
        if (lastInGroup && !firstInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-last');
            } else {
                containerClass.push('sk-msg-appmaker-last');
            }
        }
        if (!firstInGroup && !lastInGroup) {
            if (isAppUser) {
                containerClass.push('sk-msg-appuser-middle');
            } else {
                containerClass.push('sk-msg-appmaker-middle');
            }
        }

        const fromName = <div className='sk-from'>
                             { isAppUser ? '' : name }
                         </div>;

        return <div className={ 'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row') }>
                   { !isAppUser && firstInGroup ? fromName : '' }
                   { lastInGroup ? avatar : avatarPlaceHolder }
                   <div className='sk-msg-wrapper'>
                       <div className={ containerClass.join(' ') }
                            style={ style }
                            ref='messageContent'>
                           { message }
                           { actionList }
                       </div>
                   </div>
                   <div className='sk-clear'></div>
               </div>;
    }
}
