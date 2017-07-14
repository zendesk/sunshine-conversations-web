import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sendMessage, sendLocation } from '../actions/conversation';
import { getRGB, rgbToHsl } from '../utils/colors';
import { hasGeolocationSupport } from '../utils/dom';
import { bindAll } from '../utils/functions';

import LocationIcon from './LocationIcon';

export class ReplyActionsComponent extends Component {
    static propTypes = {
        accentColor: PropTypes.string,
        isAccentColorDark: PropTypes.bool,
        choices: PropTypes.array.isRequired,
        locationNotSupportedText: PropTypes.string.isRequired
    };

    constructor(...args) {
        super(...args);
        bindAll(this, 'onReplyClick');

        this.state = {};
    }

    onReplyClick({text, payload, metadata}) {
        const {dispatch} = this.props;
        dispatch(sendMessage({
            text,
            payload,
            metadata
        }));
    }

    onSendLocation(data) {
        const {dispatch, locationNotSupportedText} = this.props;

        if (hasGeolocationSupport()) {
            dispatch(sendLocation(data));
        } else {
            alert(locationNotSupportedText);
        }
    }

    render() {
        const {choices, accentColor, isAccentColorDark} = this.props;
        const buttonStyle = {};

        if (accentColor) {
            const rgb = getRGB(`#${accentColor}`);
            const {h} = rgbToHsl(...rgb);
            buttonStyle.backgroundColor = isAccentColorDark ? `hsl(${h}, 100%, 95%)` : `hsl(${h}, 100%, 98%)`;
            buttonStyle.borderColor = `#${accentColor}`;
            buttonStyle.color = `#${accentColor}`;
        }

        const items = choices.map(({text, iconUrl, type, payload, metadata}, index) => {
            const isLocationRequest = type === 'locationRequest';

            const onClick = (e) => {
                e.preventDefault();

                if (isLocationRequest) {
                    this.onSendLocation({
                        metadata
                    });
                } else {
                    this.onReplyClick({
                        text,
                        payload,
                        metadata
                    });
                }
            };

            const locationIcon = <LocationIcon/>;
            const imageIcon = <img className='sk-reply-action-icon'
                                   alt='Icon'
                                   src={ iconUrl } />;

            const icon = isLocationRequest ? locationIcon :
                iconUrl ? imageIcon :
                    null;

            return <button className='btn btn-sk-reply-action'
                           style={ buttonStyle }
                           onClick={ onClick }
                           key={ index }>
                       <span>{ icon } { text }</span>
                   </button>;
        });

        return <div className='sk-reply-container'>
                   { items }
               </div>;
    }
}

export default connect(({config, ui}) => {
    return {
        accentColor: config.style.accentColor,
        isAccentColorDark: config.style.isAccentColorDark,
        locationNotSupportedText: ui.text.locationNotSupported
    };
}, null, null, {
    withRef: true
})(ReplyActionsComponent);
