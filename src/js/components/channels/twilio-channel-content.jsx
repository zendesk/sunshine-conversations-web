import React, { Component, PropTypes } from 'react';
import isMobile from 'ismobilejs';
import { TelephoneInput } from '../telephone-input';

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

        return <TelephoneInput ref='telInput'
                               defaultCountry='ca'
                               onChange={ this.handleInputChange }
                               preferredCountries={ ['ca', 'us'] }
                               onBlur={ this.handleInputBlur } />;
    }
}
