import React, { Component } from 'react';
import { createMarkup, autolink, escapeHtml } from 'utils/html';

export class TextMessage extends Component {
    static propTypes = {
        text: React.PropTypes.string.isRequired,
        actions: React.PropTypes.array.isRequired,
        role: React.PropTypes.string.isRequired
    };

    render() {
        let text = this.props.text.split('\n').map((item, index) => {
            if (!item.trim()) {
                return;
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

        if (this.props.actions.length > 0) {
            text = <span className='has-actions'>{ text }</span>;
        } else {
            text = <span>{ text }</span>;
        }

        return text;
    }
}
