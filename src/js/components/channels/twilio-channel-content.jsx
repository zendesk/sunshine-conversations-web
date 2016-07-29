import React, { Component } from 'react';
import { updateTwilioAttributes, resetTwilioAttributes, linkTwilioChannel, deleteTwilioChannel } from '../../services/integrations-service';

import { ReactTelephoneInput } from '../../lib/react-telephone-input';

import { connect } from 'react-redux';
import isMobile from 'ismobilejs';

export class TwilioChannelContentComponent extends Component {

    linkTwilioNumber = () => {
        linkTwilioChannel(this.props.userId, {
            type: 'twilio', 
            phoneNumber: this.props.appUserNumber.replace(/[()\-\s]/g, '')
        });
    }

    deleteChannel = () => {
        deleteTwilioChannel(this.props.userId);
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
        updateTwilioAttributes({
            linkState: 'linked'
        });
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
        const {appUserNumber, appUserNumberValid, phoneNumber, linkState, settings: {linkColor}} = this.props;
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
                                     <a onClick={ this.deleteChannel }>Retry</a>
                                 </div>;

        const sendTextUrl = `sms://${phoneNumber}`;
        const linkedComponentButton = isMobile.phone ? <button className='btn btn-sk-primary twilio-linking'
                                                               onClick={ this.onStartTexting }>
                                                           Start Texting
                                                       </button> :
            <button className='btn btn-sk-primary twilio-linking'
                    onClick={ this.onSendText }>
                Send me a text
            </button>;

        const linkedComponent = <div>
                                    <div className='twilio-linking linked-state'>
                                        <i className='fa fa-phone'
                                           style={ iconStyle }></i>
                                        <span className='phone-number'>{ appUserNumber }</span>
                                        <a onClick={ this.deleteChannel }>Change my number</a>
                                    </div>
                                    <a href={ sendTextUrl }>
                                        { linkedComponentButton }
                                    </a>
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
        settings: state.app.settings.web,
        userId: state.user._id
    };
})(TwilioChannelContentComponent);
