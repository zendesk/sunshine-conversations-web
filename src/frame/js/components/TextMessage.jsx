import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createMarkup, autolink, escapeHtml } from '../utils/html';

export default class TextMessage extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        className: PropTypes.string,
        type: PropTypes.string,
        role: PropTypes.string.isRequired
    };

    render() {
        const linkOptions = {
            target: '_blank',
            class: 'link'
        };

        const isAppUser = this.props.role === 'appUser';

        if (!isAppUser && this.props.linkColor) {
            linkOptions.style = `color: #${this.props.linkColor}`;
        }

        let text = [];

        if (this.props.text.trim()) {
            text = this.props.text.trim().split('\n').map((item, index) => {
                if (!item.trim()) {
                    return <br key={ index } />;
                }

                const innerHtml = createMarkup(autolink(escapeHtml(item), linkOptions));

                return <span key={ index }><span dangerouslySetInnerHTML={ innerHtml }></span>
                       <br/>
                       </span>;
            });
        }

        if (this.props.type === 'file') {
            const innerHtml = createMarkup(autolink(escapeHtml(this.props.mediaUrl), linkOptions));
            text.push(<span key='fileUrl'><span dangerouslySetInnerHTML={ innerHtml }></span>
                      <br/>
                      </span>);
        }

        return <span className={ this.props.className }>{ text }</span>;
    }
}
