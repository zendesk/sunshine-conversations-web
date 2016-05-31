import React, { Component } from 'react';

import { TextMessage } from './text-message';
import { ImageMessage } from './image-message';
import { ActionComponent } from './action';


export class MessageComponent extends Component {
    static defaultProps = {
        actions: []
    };

    render() {
        const actions = this.props.actions.map((action) => {
            return <ActionComponent key={ action._id }
                                    buttonColor={ this.props.linkColor }
                                    {...action} />;
        });

        const isAppUser = this.props.role === 'appUser';

        const avatarClass = this.props.mediaUrl ? ['sk-msg-avatar', 'sk-msg-avatar-img'] : ['sk-msg-avatar'];
        const avatar = isAppUser ? null : (
            <img className={ avatarClass.join(' ') }
                 src={ this.props.avatarUrl } />
            );
        const avatarPlaceHolder = isAppUser ? null : (<div className='sk-msg-avatar-placeholder'/>);

        const message = this.props.mediaUrl ?
            <ImageMessage {...this.props} /> :
            <TextMessage {...this.props} />;

        const containerClass = [this.props.mediaUrl ? 'sk-msg-image' : 'sk-msg'];

        if (this.props.actions.length > 0) {
            containerClass.push('has-actions');
        }

        const style = {};

        if (!this.props.mediaUrl) {
          if (isAppUser && this.props.accentColor) {
            style.backgroundColor = style.borderLeftColor = `#${this.props.accentColor}`;
          }
          if (this.props.firstInGroup && !this.props.lastInGroup) {
            if (isAppUser) {
              containerClass.push('sk-msg-appuser-first');
            } else {
              containerClass.push('sk-msg-appmaker-first');
            }
          }
          if (this.props.lastInGroup && !this.props.firstInGroup) {
            if (isAppUser) {
              containerClass.push('sk-msg-appuser-last');
            } else {
              containerClass.push('sk-msg-appmaker-last');
            }
          }
          if (!this.props.firstInGroup && !this.props.lastInGroup) {
            if (isAppUser) {
              containerClass.push('sk-msg-appuser-middle');
            } else {
              containerClass.push('sk-msg-appmaker-middle');
            }
          }
        }

        const fromName = <div className='sk-from'>
                           { isAppUser ? '' : this.props.name }
                       </div>;

        return <div className={ 'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row') }>
                   { this.props.lastInGroup ? avatar : avatarPlaceHolder }
                   <div className='sk-msg-wrapper'>
                       {!isAppUser && this.props.firstInGroup ? fromName : ''}
                       <div className={ containerClass.join(' ') }
                            style={ style }>
                           { message }
                           { actions }
                       </div>
                   </div>
                   <div className='sk-clear'></div>
               </div>;
    }
}
