import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { sendMessage } from '../services/conversation-service';
import { getRGB, rgbToHsl } from '../utils/colors';

export class QuickRepliesComponent extends Component {
    static propTypes = {
        accentColor: PropTypes.string.isRequired,
        isLinkColorDark: PropTypes.bool.isRequired,
        choices: PropTypes.array.isRequired
    };

    onReplyClick = ({text, payload}) => {
        sendMessage(text, {
            payload
        });
    };

    render() {
        const {choices, accentColor, isLinkColorDark} = this.props;

        const buttonStyle = {};

        if (accentColor) {
            const rgb = getRGB(`#${accentColor}`);
            const {h} = rgbToHsl(...rgb);
            buttonStyle.backgroundColor = isLinkColorDark ? `hsl(${h}, 100%, 95%)` : `hsl(${h}, 100%, 98%)`;
            buttonStyle.borderColor = `#${accentColor}`;
            buttonStyle.color = `#${accentColor}`;
        }

        const items = choices.map(({text, payload, iconUrl} , index) => {
            const onClick = (e) => {
                e.preventDefault();
                this.onReplyClick({
                    text,
                    payload
                });
            };

            const icon = iconUrl ?
                <img className='sk-quick-reply-icon'
                     src={ iconUrl } /> :
                null;

            return <button className='btn btn-sk-quick-reply'
                           style={ buttonStyle }
                           onClick={ onClick }
                           key={ index }>
                       { icon }
                       { text }
                   </button>;
        });

        return <div className='sk-quick-replies-container'>
                   { items }
               </div>;
    }
}

export const QuickReplies = connect(({app}) => {
    return {
        accentColor: app.settings.web.accentColor,
        isLinkColorDark: app.settings.web.isLinkColorDark
    };
})(QuickRepliesComponent);
