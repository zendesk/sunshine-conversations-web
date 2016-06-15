import React, { Component, PropTypes } from 'react';
import isMobile from 'ismobilejs';

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

        if (isMobile.any) {
            return <a href={ `sms:${phoneNumber}` }
                      style={ styleOverride }
                      target='_blank'>
                       { phoneNumber }
                   </a>;

        }
        return <span>{ phoneNumber }</span>;
    }
}
