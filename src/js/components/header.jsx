import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import bindAll from 'lodash.bindall';

import { toggleWidget } from '../services/app';
import { Introduction } from './introduction';
import {DefaultCloseIcon} from "./default-close-icon";

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
        return (
            <div id='sk-header'>
                <div
                    className='sk-close-handle'
                    onClick={this.onClick}
                >
                    <DefaultCloseIcon/>
                 </div>
                <Introduction/>
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
