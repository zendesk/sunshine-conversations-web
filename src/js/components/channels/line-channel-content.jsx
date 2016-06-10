import React, { Component, PropTypes } from 'react';

export class LineChannelContent extends Component {
    static contextTypes = {
        settings: PropTypes.object
    }

    render() {
        const {settings} = this.context;
        const {botName} = this.props;
        const styleOverride = settings.linkColor ? {
            color: `#${settings.linkColor}`
        } : null;

        return <p style={ styleOverride }>
                   { botName }
               </p>;
    }
}
