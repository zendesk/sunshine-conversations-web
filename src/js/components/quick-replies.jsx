import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { sendMessage } from '../services/conversation-service';
import { getRGB, rgbToHsl } from '../utils/colors';

export class QuickRepliesComponent extends Component {
    static propTypes = {
        buttonColor: PropTypes.string,
        choices: PropTypes.array.isRequired
    };

    onReplyClick = ({text, payload}) => {
        Promise
            .resolve()
            .then(() => {
                // animate the message
            })
            .then(() => sendMessage(text, {
                payload
            }));
    };


    render() {
        const {choices, buttonColor} = this.props;

        const buttonStyle = {};

        if (buttonColor) {
            const rgb = getRGB(`#${buttonColor}`);
            const {h} = rgbToHsl(...rgb);
            buttonStyle.backgroundColor = `hsl(${h}, 100%, 95%)`;
            buttonStyle.borderColor = `#${buttonColor}`;
            buttonStyle.color = `#${buttonColor}`;
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
        buttonColor: app.settings.web.linkColor
    };
})(QuickRepliesComponent);
