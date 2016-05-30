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

        const avatar = isAppUser ? null : (
            <img className='sk-msg-avatar'
                 src={ this.props.avatarUrl } />
            );
        const avatarPlaceHolder = isAppUser? null : (<div className='sk-msg-avatar-placeholder'/>);

        const message = this.props.mediaUrl ?
            <ImageMessage {...this.props} /> :
            <TextMessage {...this.props} />;

        const containerClass = [this.props.mediaUrl ? 'sk-msg-image' : 'sk-msg'];

        if (this.props.actions.length > 0) {
            containerClass.push('has-actions');
        }

        const style = {};

        if (!this.props.mediaUrl) {
          style.borderTopLeftRadius = style.borderTopRightRadius = style.borderBottomLeftRadius = style.borderBottomRightRadius = 16;
          if (isAppUser && this.props.accentColor) {
            style.backgroundColor = style.borderLeftColor = `#${this.props.accentColor}`;
          }
          if (this.props.firstInGroup && !this.props.lastInGroup) {
            if (isAppUser) {
              style.borderBottomRightRadius = 2;
            } else {
              style.borderBottomLeftRadius = 2;
            }
          }
          if (this.props.lastInGroup && !this.props.firstInGroup) {
            if (isAppUser) {
              style.borderTopRightRadius = 2;
            } else {
              style.borderTopLeftRadius = 2;
            }
          }
          if (!this.props.firstInGroup && !this.props.lastInGroup) {
            if (isAppUser) {
              style.borderBottomRightRadius = style.borderTopRightRadius = 2;
            } else {
              style.borderBottomLeftRadius = style.borderTopLeftRadius = 2;
            }
          }
        }
        
        if (this.props.lastInGroup) {
          style.marginBottom = 3;
        }

        const styleRow = {
          paddingBottom: 0,
          paddingTop: 2
        };


        const fromName = <div className='sk-from'>
                           { isAppUser ? '' : this.props.name }
                       </div>;

        return <div className={ 'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row') }
                    style={ styleRow }>
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
