import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { ActionComponent } from 'components/action';

import { createMarkup, autolink, escapeHtml } from 'utils/html';

export class MessageComponent extends Component {
    static defaultProps = {
        actions: []
    };

    render() {
        const actions = this.props.actions.map((action) => {
            return <ActionComponent key={ action._id } {...action} />;
        });

        const isAppUser = this.props.role === 'appUser';

        let avatar = isAppUser ? null : (
            <img className='sk-msg-avatar' src={ this.props.avatarUrl } />
            );

        let text = this.props.text.split('\n').map((item, index) => {
            if (!item.trim()) {
                return;
            }


            let innerHtml = createMarkup(autolink(escapeHtml(item), {
                target: '_blank',
                class: 'link'
            }));

            return <span key={ index }><span dangerouslySetInnerHTML={ innerHtml }></span>
                   <br/>
                   </span>;
        });

        if (this.props.actions.length > 0) {
            text = <span className='has-actions'>{ text }</span>;
        }

        return (
            <div className={ 'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row') }>
                { avatar }
                <div className='sk-msg-wrapper'>
                    <div className='sk-from'>
                        { isAppUser ? '' : this.props.name }
                    </div>
                    <div className='sk-msg'>
                        { text }
                        { actions }
                    </div>
                </div>
                <div className='sk-clear'></div>
            </div>
            );
    }
}
