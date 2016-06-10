import React, { Component, PropTypes } from 'react';

export class EmailChannelContent extends Component {
    static contextTypes = {
        settings: PropTypes.object
    }

    render() {
        const {settings} = this.context;
        const {fromAddress, smoochAddress} = this.props;
        const email = fromAddress || smoochAddress;

        const styleOverride = settings.linkColor ? {
            color: `#${settings.linkColor}`
        } : null;

        return <a href={ `mailto:${email}` }
                  style={ styleOverride }
                  target='_blank'>
                   { email }
               </a>;
    }
}
