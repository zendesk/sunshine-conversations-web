import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createMarkup, autolink, escapeHtml } from '../utils/html';

export class TextMessage extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        className: PropTypes.string,
        role: PropTypes.string.isRequired
    };

    render() {
        const text = this.props.text.split('\n').map((item, index) => {
            if (!item.trim()) {
                return <br key={ index } />;
            }

            const linkOptions = {
                target: '_blank',
                class: 'link'
            };

            const isAppUser = this.props.role === 'appUser';

            if (!isAppUser && this.props.linkColor) {
                linkOptions.style = `color: #${this.props.linkColor}`;
            }

            const innerHtml = createMarkup(autolink(escapeHtml(item), linkOptions));

            return <span key={ index }><span dangerouslySetInnerHTML={ innerHtml }></span>
                   <br/>
                   </span>;
        });

        return <span className={ this.props.className }>{ text }</span>;
    }
}
