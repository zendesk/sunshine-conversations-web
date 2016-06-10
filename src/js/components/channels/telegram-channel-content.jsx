import React, { Component, PropTypes } from 'react';

export class TelegramChannelContent extends Component {
    static contextTypes = {
        settings: PropTypes.object
    }

    render() {
        const {settings} = this.context;
        const {username} = this.props;
        const styleOverride = settings.linkColor ? {
            color: `#${settings.linkColor}`
        } : null;

        return <p style={ styleOverride }>
                   { username }
               </p>;
    }
}
