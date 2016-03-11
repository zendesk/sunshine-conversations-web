import React, { Component } from 'react';

export class ImageMessage extends Component {
    static propTypes = {
        mediaUrl: React.PropTypes.string.isRequired
    };

    render() {
        return <img src={ this.props.mediaUrl } />;
    }
}
