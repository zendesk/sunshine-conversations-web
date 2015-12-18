import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { connect } from 'react-redux';

import { createMarkup, autolink } from 'utils/html';

export class MessageComponent extends Component {
    render() {
        const actions = this.props.actions.map((action) => {
            return (
            <div key={ action._id } className="sk-action">
                    <a className="btn btn-sk-primary" href={ action.uri } target="_blank">{action.text}</a>
                </div>
            );
        });

        const isAppUser = this.props.role === 'appUser';
        let avatar = isAppUser ? '' : (
            <img className="sk-msg-avatar" src={ this.props.avatarUrl } />
            );

        let text = this.props.text.split('\n').map((item, index) => {
            if (!item.trim()) {
                return;
            }

            return (
            <span key={index}>
                    <span dangerouslySetInnerHTML={createMarkup(autolink(item, {
                target: '_blank'
            }))}></span>
                    <br/>
                </span>
            );
        });

        return (
        <div className={'sk-row ' + (isAppUser ? 'sk-right-row' : 'sk-left-row')}>
                { avatar }
                <div className="sk-msg-wrapper">
                    <div className="sk-from">{ isAppUser ? '' : this.props.name }</div>
                    <div className="sk-msg">
                        { text }
                        { actions }
                    </div>
                </div>
                <div className="sk-clear"></div>
            </div>
        );
    }
}
