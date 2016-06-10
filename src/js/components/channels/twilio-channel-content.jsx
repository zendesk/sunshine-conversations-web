import React, { Component, PropTypes } from 'react';

export class TwilioChannelContent extends Component {
    static contextTypes = {
        settings: PropTypes.object
    }

    render() {
        const {settings} = this.context;
        const {phoneNumber} = this.props;
        const styleOverride = settings.linkColor ? {
            color: `#${settings.linkColor}`
        } : null;

        return <a href={ `tel:${phoneNumber}` }
                  style={ styleOverride }
                  target='_blank'>
                   { phoneNumber }
               </a>;
    }
}
