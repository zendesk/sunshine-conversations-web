import React, { Component, PropTypes } from 'react';
import { updateTwilioAttributes, resetTwilioAttributes, linkTwilioChannel, unlinkTwilioChannel, pingTwilioChannel } from '../../services/integrations-service';

import { ReactTelephoneInput } from '../../lib/react-telephone-input';

import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

export class TwilioChannelContentComponent extends Component {

    static contextTypes = {
        settings: PropTypes.object
    };

    linkTwilioNumber = () => {
        linkTwilioChannel(this.props.userId, {
            type: 'twilio', 
            phoneNumber: this.props.appUserNumber.replace(/[()\-\s]/g, '')
        });
    }

    unlinkChannel = () => {
        unlinkTwilioChannel(this.props.userId);
    }

    handleInputChange = (telNumber) => {
        updateTwilioAttributes({
            appUserNumber: telNumber
        });
    }

    onChangeNumber = () => {
        updateTwilioAttributes({
            linkState: 'unlinked',
            appUserNumber: '',
            appUserNumberValid: false
        });
    }

    onStartTexting = () => {
        updateTwilioAttributes({
            linkState: 'linked'
        });
    }

    onSendText = () => {
        pingTwilioChannel(this.props.userId);
    }

    onNumberValid = () => {
        updateTwilioAttributes({
            appUserNumberValid: true
        });
    }

    onNumberInvalid = () => {
        updateTwilioAttributes({
            appUserNumberValid: false
        });
    }

    componentWillUnmount() {
        resetTwilioAttributes();
    }

    render() {
        const {appUserNumber, appUserNumberValid, phoneNumber, linkState} = this.props;
        const {settings: {linkColor}} = this.context;
        let iconStyle = {};
        if (linkColor) {
            iconStyle = {
                color: `#${linkColor}`
            };
        }

        const linkButton = appUserNumberValid ? <button className='btn btn-sk-primary'
                                                        onClick={ this.linkTwilioNumber }>
                                                    Continue
                                                </button> : '';
        const unlinkedComponent = <div>
                                      <ReactTelephoneInput ref={ (c) => this._telInput = c }
                                                           defaultCountry='ca'
                                                           onChange={ this.handleInputChange }
                                                           onValid={ this.onNumberValid }
                                                           onInvalid={ this.onNumberInvalid }
                                                           preferredCountries={ ['ca', 'us'] }
                                                           onBlur={ this.handleInputBlur } />
                                      { linkButton }
                                  </div>;
        const pendingComponent = <div className='twilio-linking pending-state'>
                                     <i className='fa fa-phone'
                                        style={ iconStyle }></i>
                                     <span className='phone-number'>{ appUserNumber } - Pending</span>
                                     <a onClick={ this.unlinkChannel }>Retry</a>
                                 </div>;

        const sendTextUrl = `sms://${phoneNumber}`;
        const linkedComponentButton = isMobile.phone ? <a href={ sendTextUrl }>
                                                           <button className='btn btn-sk-primary twilio-linking'
                                                                   onClick={ this.onStartTexting }> Start Texting </button>
                                                       </a> :
            <button className='btn btn-sk-primary twilio-linking'
                    onClick={ this.onSendText }>
                Send me a text
            </button>;

        const linkedComponent = <div>
                                    <div className='twilio-linking linked-state'>
                                        <i className='fa fa-phone'
                                           style={ iconStyle }></i>
                                        <span className='phone-number'>{ appUserNumber }</span>
                                        <a onClick={ this.unlinkChannel }>Change my number</a>
                                    </div>
                                    { linkedComponentButton }
                                </div>;
        if (linkState === 'pending') {
            return pendingComponent;
        } else if (linkState === 'linked') {
            return linkedComponent;
        } else {
            return unlinkedComponent;
        }
    }
}

export const TwilioChannelContent = connect((state) => {
    return {
        ...state.integrations.twilio,
        userId: state.user._id
    };
})(TwilioChannelContentComponent);
