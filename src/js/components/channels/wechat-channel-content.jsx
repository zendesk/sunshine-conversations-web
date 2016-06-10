import React, { Component, PropTypes } from 'react';

export class WeChatChannelContent extends Component {
    static contextTypes = {
        settings: PropTypes.object
    }

    render() {
        const {settings} = this.context;
        const styleOverride = settings.linkColor ? {
            color: `#${settings.linkColor}`
        } : null;

        return <div style={ styleOverride }>
                   imagine_this_is_a_QR_code
               </div>;
    }
}
