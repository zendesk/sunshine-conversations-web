import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createMarkup } from 'utils/html';
import { preventDefault } from 'utils/events';

import { hideErrorNotification } from 'actions/app-state-actions';

export class ErrorNotificationComponent extends Component {
    render() {
        const linkStyle = {
            cursor: 'pointer'
        };

        return (
            <div key='content'
                 className='sk-notification sk-notification-error'
                 onClick={ this.props.actions.hideErrorNotification }>
                <p>
                    <span ref='text'
                          dangerouslySetInnerHTML={ createMarkup(this.props.message) }></span>
                    <a style={ linkStyle }
                       onClick={ preventDefault }
                       className='sk-notification-close'>&times;</a>
                </p>
            </div>
            );
    }
}

export const ErrorNotification = connect(undefined, (dispatch) => {
    return {
        actions: bindActionCreators({
            hideErrorNotification
        }, dispatch)
    };
})(ErrorNotificationComponent);
