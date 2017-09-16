import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';

import { toggleWidget } from '../services/app';
import { WIDGET_STATE } from '../constants/app';
import { Introduction } from './introduction';

export class HeaderComponent extends Component {

    static propTypes = {
        appState: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired,
        text: PropTypes.object.isRequired,
        unreadCount: PropTypes.number.isRequired
    };

    constructor(...args) {
        super(...args);
        bindAll(this,
            'onClick'
        );
    }

    onClick(e) {
        e.preventDefault();
        const {dispatch, appState: {embedded}} = this.props;
        if (!embedded) {
            dispatch(toggleWidget());
        }
    }

    render() {
        const {appState: {widgetState, embedded}} = this.props;

        const widgetOpened = widgetState === WIDGET_STATE.OPENED;

        let closeHandle = null;
        if (!embedded) {
            closeHandle = widgetOpened ? (
                <div
                    className='sk-close-handle sk-close-hidden'
                    onClick={this.onClick}
                >
                     <i className='fa fa-times'/>
                 </div>
            ) : null;
        }

        return (
            <div id='sk-header'>
                <Introduction/>
                { closeHandle }
            </div>
        );
    }
}

function mapStateToProps({app, ui: {text}, appState: {emailCaptureEnabled, settingsVisible, widgetState, embedded, visibleChannelType}, conversation}) {
    return {
        appState: {
            emailCaptureEnabled,
            settingsVisible,
            widgetState,
            embedded,
            visibleChannelType
        },
        unreadCount: conversation.unreadCount,
        settings: app.settings.web,
        text
    };
}

export const Header = connect(mapStateToProps)(HeaderComponent);
