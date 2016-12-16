import React, { Component } from 'react';
import { createMarkup, autolink, escapeHtml } from '../utils/html';

export class TextMessage extends Component {
    static propTypes = {
        text: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        role: React.PropTypes.string.isRequired
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
