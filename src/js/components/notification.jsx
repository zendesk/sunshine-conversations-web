import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { createMarkup } from 'utils/html';

import { hideSettingsNotification, showSettings } from 'actions/app-state-actions';

export class NotificationComponent extends Component {
    static defaultProps = {
        settings: {}
    };

    bindHandler() {
        const node = findDOMNode(this);
        const linkNode = node.querySelector('[data-ui-settings-link]');
        if (linkNode) {
            linkNode.onclick = this.onLinkClick.bind(this);

            if (this.props.settings.linkColor) {
                linkNode.style = `color: #${this.props.settings.linkColor}`;
            }
        }
    }

    componentDidMount() {
        this.bindHandler();
    }

    componentDidUpdate() {
        this.bindHandler();
    }


    onLinkClick(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.actions.hideSettingsNotification();
        this.props.actions.showSettings();
    }

    render() {
        const linkStyle = {
            cursor: 'pointer'
        };
        return (
            <div key='content'
                 className='sk-notification'
                 onClick={ this.props.actions.hideSettingsNotification }>
                <p>
                    <span ref='text'
                          dangerouslySetInnerHTML={ createMarkup(this.props.ui.text.settingsNotificationText) }></span>
                    <a style={ linkStyle }
                       className='sk-notification-close'
                       onClick={ this.props.actions.hideSettingsNotification }>&times;</a>
                </p>
            </div>
            );
    }
}

export const Notification = connect((state) => {
    return {
        ui: state.ui,
        settings: state.app.settings && state.app.settings.web
    };
}, (dispatch) => {
    return {
        actions: bindActionCreators({
            hideSettingsNotification,
            showSettings
        }, dispatch)
    };
})(NotificationComponent);
